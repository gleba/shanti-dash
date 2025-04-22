import {Message} from "@grammyjs/types";
import {DB} from "./db.ts";
import {classifyMessageText} from "./parser.сlassifier.ts";
import {isProd} from "./constatnts.ts";
import {registrationAction} from "./registration.action.ts";
import {schedules} from "./schedules.ts";
import { historicalMessage } from './history.sync.ts'

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
    DB.messages.upsert(m, m)
    handleMessage(m)
}

function handleMessage(msg: Message) {

    const messageType = classifyMessageText(msg.text);
    console.log(msg.message_id, messageType, msg.text )
    historicalMessage(msg, messageType)
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
