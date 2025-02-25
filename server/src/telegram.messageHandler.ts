import {Context} from "grammy";
import {Message} from "@grammyjs/types";
import {DB} from "./db.ts";
import {classifyMessageText} from "./parser.сlassifier.ts";
import {stateCurrent} from "./state.current.ts";
import {timeAction} from "./parser.time.action.ts";
import {registrationAction} from "./GroupState.ts";

// DB.db.query("select value from messages").all()
//     .forEach(v => {
//         const m = JSON.parse(v.value)
//         // console.log(m)
//         // DB.messages.addValue(m.message_id, m.chat.id, m.forward_date || m.date, JSON.stringify(m))
//     })


export function restore() {
    DB.messages
        .getValuesFromLastDays(-1002470999811, 3)
        .forEach(handleMessage)
    console.info("")
    console.info("restore complete")

}

export async function telegramMessageHandler(ctx: Context) {
    if (!ctx.message?.text || ctx.message?.text.length < 4) {
        return;
    }
    const m = ctx.message
    // console.log(":::", m)
    // DB.messages.addValue(m.message_id, m.chat.id, m.date, JSON.stringify(m))
    // handleMessage(m)
}

function handleMessage(msg: Message) {
    const text = msg.text as string
    const groupId = msg.chat.id
    // const ts = msg.forward_date || msg.date
    // const d = new Date(ts *1000 );
    if (text.length < 50) {
        const groupState = stateCurrent.current(groupId)
        if (groupState) {
            const action = registrationAction(groupState)
            text.split("\n").forEach((line) => {
                const ta = timeAction(line)
                action(msg, ta)
            })
        } else {
            console.write("_")
        }
    } else {
        const messageType = classifyMessageText(text);
        switch (messageType) {
            case "active":
                stateCurrent.newActive(msg)
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
