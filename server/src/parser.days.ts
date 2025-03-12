import {Message} from "@grammyjs/types";
import parseTgMsgToHtml from "./parser.tgMsgToHtml.ts";
import {parserRT} from "./parser.rut.ts";
import {timeAction} from "./parser.time.action.ts";
import {notifyError} from "./telegram.ts";


function removeSpaces(str:string):string {
    return str.replace(/\s/g, '');
}
export async function parseDay(msx: Message, mode: string) {
    let data
    console.log("start GPT parser")
    const htmlText = parseTgMsgToHtml(msx)
    const completion = await parserRT(htmlText) as any

    if (!completion) {
        console.log(msx.text)
        console.log({completion})
        console.error("GPT FALL, empty, completion for")
        return
    }
    let content = completion?.choices[0]?.message?.content || completion?.choices[0]?.message //as string
    if (content.startsWith("```json")) {
        content = content.replaceAll("```json", "")
        content = content.replaceAll("```", "")
    }
    try {
        data = JSON.parse(content)
    } catch (error) {
        console.log("GPT JSON invalid")
        console.log(error)
        console.error("GPT JSON invalid")
    }
    console.log("GPT parser complete")
    return {data, htmlText}
}


export async function parseBigDay(msx: Message) {
    const events = {} as any
    let title = ""
    const { data, htmlText} = await parseDay(msx, "big")

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
