import {Message} from "@grammyjs/types";
import {DB} from "./db.ts";
import {parserGiga, PromptPreset} from "./parser.giga.ts";
import parseTgMsgToHtml from "./parser.tgMsgToHtml.ts";
import {timeAction} from "./parser.time.action.ts";
import {notifyError} from "./telegram.ts";
import {atomicState} from "./state.atomic.ts";

function removeSpaces(str:string):string {
    return str.replace(/\s/g, '');
}
async function parseDay(msx: Message, mode: PromptPreset) {
    let data
    console.log("new state")
    const htmlText = parseTgMsgToHtml(msx)
    console.log("start Giga-parser ")
    let completion = DB.gpt.getFromMsx(msx)
    if (!completion) {
        completion = await parserGiga(htmlText, mode)
        DB.gpt.addValueFromMessage(msx, completion)
    }
    let v = completion?.choices[0]?.message?.content
    try {
        data = JSON.parse(v)
    } catch (error) {
        console.log("GPT JSON invalid")
        console.log(error)
        console.error("GPT JSON invalid")
    }
    return {data, htmlText}
}


async function parseBigDay(msx: Message) {
    const events = {} as any
    let title = ""
    const { data, htmlText} = await parseDay(msx, "big")
    // console.log("::::::::::::::::", data)
    if (data) {
        const oneDay = data as OneDayEvents
        title = oneDay.date
        if (oneDay.isValid) {
            oneDay.events.forEach((e: SingleEvent) => {
                e.time = removeSpaces(e.time)
                const startTime = timeAction(e.time)
                if (startTime.time) {
                    events[startTime.time] = e
                } else {
                    notifyError("событие без времени", e)
                }
            })
        } else {
            notifyError("расписание не валидировано", oneDay)
        }
    }
    return {events, htmlText, title} as any as DailySchedule
}

async function newSchedule(msx: Message) {
    const id = msx.message_id
    const groupId = msx.chat.id

    let schedule = DB.schedule.get(groupId, id)

    if (!schedule || !Object.keys(schedule.events).length) {
        const data = await parseBigDay(msx)
        schedule = Object.assign(data, {
            id,
            groupId
        })
        DB.schedule.upsert(msx, schedule)
    }
    const {core} = atomicState.groups[groupId]
    core.dailySchedule(schedule)
    core.archive()
    console.write("@")
}

const currentSchedule = (groupId: number) => {
    return atomicState.groups[groupId].state?.dailySchedule
}
export const stateCurrent = {
    newSchedule,
    currentSchedule,
    async update(msx: Message) {
        let r = DB.overrides.getFromMsx(msx) as DailySchedule
        if (!r) {
            r = await parseBigDay(msx)
            DB.overrides.addValueFromMessage(msx, r)
        }
        currentSchedule(msx.chat.id) &&
        atomicState.groups[msx.chat.id].core.dailySchedule.mutate(gs =>
            Object.assign(gs, {override: r.events})
        )
    },
    cancelTime(msx: Message) {
        if (msx.text) {
            const at = timeAction(msx.text)
            if (currentSchedule(msx.chat.id) && at.time) {
                atomicState.groups[msx.chat.id].core.dailySchedule.mutate(gs => {
                        //@ts-ignore
                        if (gs.events[at.time]) {
                            gs.events[at.time].canceled = true
                        } else {
                            console.log('wrong cancelTime', at.time)
                        }
                        return gs
                    }
                )
            }
            console.write("-")
        }
    },
}
