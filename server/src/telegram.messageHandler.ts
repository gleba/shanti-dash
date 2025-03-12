import {Message} from "@grammyjs/types";
import {DB} from "./db.ts";
import {classifyMessageText} from "./parser.сlassifier.ts";
import {isProd} from "./constatnts.ts";
import {registrationAction} from "./registration.action.ts";
import {schedules} from "./schedules.ts";

const prodChat = -1001646592889
const devChat = prodChat

// const devChat = -1002470999811

export function restore() {
    console.log("restore isProd", isProd, isProd ? prodChat : devChat)
    const m = DB.messages
        .lastEvent(isProd ? prodChat : devChat)
    const z = m //.slice(0, 43)
    console.info("restore : ", z.length)
    z.forEach(handleMessage)
    console.info("restore complete")
}

export async function telegramMessageHandler(message: Message, mode: string) {
    if (!message?.text || message?.text.length < 4) {
        console.log(message)
        return;
    }
    const m = message
    console.write("|")
    switch (mode) {
        case "is_edit":
            DB.messages.upsert(m, m)
            DB.schedule.delete(m)
            handleDelete(m)
            handleMessage(m)
            break
        default:
            DB.messages.addValue(m.message_id, m.chat.id, m.date, JSON.stringify(m))
            handleMessage(m)
    }
}

function handleDelete(msg: Message) {
    const groupId = msg.chat.id
    // const ag = atomicState.groups[groupId]
    // let dr = ag.state.dailyRegistrations
    // if (dr) {
    //     for (const t in dr.active){
    //         dr.active[t] = dr.active[t].filter(m=>{
    //             return m.message.message_id != msg.message_id
    //         })
    //     }
    //     ag.core.dailyRegistrations(dr)
    // }
}

function handleMessage(msg: Message) {
    const messageType = classifyMessageText(msg.text);
    switch (messageType) {
        case "registrationNew":
        case "registrationCancel":
            registrationAction(msg)
            break
        case "scheduleNew":
            schedules.new(msg)
            break
        case "scheduleUpdate":
            schedules.update(msg)
            break
        case "scheduleCancel":
            schedules.cancelTime(msg)
            break
        default:
        // console.log("---unknown message---")
    }
}
