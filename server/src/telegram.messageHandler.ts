import {Context} from "grammy";
import {Message} from "@grammyjs/types";
import {DB} from "./db.ts";
import {classifyMessageText} from "./parser.сlassifier.ts";
import {stateCurrent} from "./state.current.ts";
import {timeAction} from "./parser.time.action.ts";
import {registrationAction} from "./DailySchedule.ts";

export function restore() {
    DB.messages
        .getValuesFromLastDays(-1001646592889, 2)
        .forEach(handleMessage)
    console.info("")
    console.info("restore complete")
}

export async function telegramMessageHandler(ctx: Context) {
    if (!ctx.message?.text || ctx.message?.text.length < 4) {
        console.write("x")
        return;
    }
    const m = ctx.message
    console.write(".")
    DB.messages.addValue(m.message_id, m.chat.id, m.date, JSON.stringify(m))
    handleMessage(m)
}

function handleMessage(msg: Message) {
    const messageText = msg.text as string
    const groupId = msg.chat.id
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
