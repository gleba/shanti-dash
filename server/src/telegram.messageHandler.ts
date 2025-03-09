import {Context} from "grammy";
import {Message} from "@grammyjs/types";
import {DB} from "./db.ts";
import {classifyMessageText} from "./parser.сlassifier.ts";
import {stateCurrent} from "./state.current.ts";
import {timeAction} from "./parser.time.action.ts";
import {getDallyRegistrations, registrationAction} from "./DailySchedule.ts";
import * as events from "node:events";
import {atomicState} from "./state.atomic.ts";
import {isProd} from "./certs.ts";
import {bot} from "./telegram.ts";

export function restore() {
    console.log("restore isProd", isProd, isProd ? -1001646592889 : -1002470999811)
    const m = DB.messages
        .lastEvent(isProd ? -1001646592889 : -1002470999811)
    console.info("restore : ", m.length)
    m.forEach(handleMessage)
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
    const ag = atomicState.groups[groupId]
    let dr = ag.state.dailyRegistrations
    if (dr) {
        for (const t in dr.active){
            dr.active[t] = dr.active[t].filter(m=>{
                return m.message.message_id != msg.message_id
            })
        }
        ag.core.dailyRegistrations(dr)
    }
}
function handleMessage(msg: Message) {
    const messageText = msg.text as string
    const groupId = msg.chat.id
    console.write(".")
    if (messageText.length < 50) {
        const groupState = stateCurrent.currentSchedule(groupId)
        if (groupState) {
            const action = registrationAction(groupState)
            messageText.split("\n").forEach((line) => {
                const ta = timeAction(line)
                action(msg, ta)
            })
        } else {
            console.write("_")
        }
    } else {
        const messageType = classifyMessageText(messageText);
        switch (messageType) {
            case "active":
                stateCurrent.newSchedule(msg)
                break;
            case "update":
                stateCurrent.update(msg)
                break
            case "cancel":
                stateCurrent.cancelTime(msg)
                break
            default:
                console.log(messageType)
        }
    }
}
