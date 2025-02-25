import {Message} from "@grammyjs/types";
import {DB} from "./db.ts";
import {parserGiga, PromptPreset} from "./parser.giga.ts";
import parseTgMsgToHtml from "./parser.tgMsgToHtml.ts";
import {timeAction} from "./parser.time.action.ts";
import {notifyError} from "./telegram.ts";
import {GroupState} from "./GroupState.ts";

export const groupStates = {} as Record<number, GroupState>

async function parseDay(msx: Message, mode: PromptPreset) {
    let data
    console.log("new state")
    const htmlText = parseTgMsgToHtml(msx)
    console.log("start Giga-parser ")
    const completion = await parserGiga(htmlText, mode)
    const v = completion?.choices[0]?.message?.content
    if (v) {
        console.log("ok")
        data = JSON.parse(v)
    }
    return {data, completion, htmlText}
}


async function parseBigDay(msx: Message) {
    const events = {} as any
    let title = ""
    const {completion, data, htmlText} = await parseDay(msx, "big")
    if (completion && data) {
        const oneDay = data as OneDayEvents
        title = oneDay.date
        if (oneDay.isValid) {
            oneDay.events.forEach((e: SingleEvent) => {
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
    return {events, htmlText, title, completion}
}

async function newActive(msx: Message) {
    const id = msx.message_id
    const groupId = msx.chat.id
    let state = DB.state.get(groupId, id)
    if (!state) {
        const data = await parseBigDay(msx)
        state = Object.assign(data, {
            id,
            groupId
        })
        DB.state.addValueFromMessage(msx, state)
    }
    groupStates[groupId] = state
    console.write("@")
}

const current = (groupId: number) => groupStates[groupId]
export const stateCurrent = {
    newActive,
    current,
    async update(msx: Message) {
        const gs = current(msx.chat.id)
        if (gs) {
            let r = DB.overrides.getFromMsx(msx)
            if (!r) {
                r= await parseBigDay(msx)
                DB.overrides.addValueFromMessage(msx, r)
            }
            gs.override = r.events
            // Object.assign(gs.events, {override: r.events})
            console.write("#")
        }
    },
    cancelTime(msx: Message) {
        const gs = current(msx.chat.id)
        if (gs && msx.text) {
            const at = timeAction(msx.text)
            if (at.time) {
                const e = gs.events[at.time] as any
                e.canceled = true
            }
            console.write("-")
        }
    },
}
