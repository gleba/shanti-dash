import {timeAction} from "./parser.time.action.ts";
import {Message, User} from "@grammyjs/types";
import {registrations} from "./registrations.store.ts";


export type SMessage = {
    id: number
    groupId: number
    text: string
    reply_to_message: SMessage
    from: User
}

export const registrationAction = (msx: Message) => {
    const message = {
        id: msx.message_id,
        groupId: msx.chat.id,
        text: msx.text,
        reply: msx.reply_to_message,
        from: msx.from,
    } as SMessage

    const r = registrations.get(message.groupId)

    const parseLine = (line: string) => {
        const action = timeAction(line)
        if (!action.pos) {
            return
        }
        if (!action.isCancel) {
            r.active.push(action.time, {action, message})
        } else {
            let cancelTime = action.time
            if (!cancelTime && message.reply_to_message) {
                //@ts-ignore
                cancelTime = timeAction(message.reply_to_message?.text).time
            }
            if (cancelTime && r.active.has(cancelTime)) {
                r.active.filter(cancelTime, a => {
                    if (a.message.from.id != message.from.id) {
                        return true
                    } else {
                        r.cancel.push(action.time, {action, message, canceled: a})
                        // console.log("::",action.time)
                        return false
                    }
                })
            }
        }
    }
    // console.log(r.cancel.sizeKeys())
    message.text.split("\n").forEach(parseLine)
    registrations.bus.dispatchEvent(message.groupId, r)
}