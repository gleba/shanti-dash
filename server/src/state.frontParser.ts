//@ts-nocheck
import {Message} from "@grammyjs/types";

function userHours(hours: HourlyRegistrations<Message>, isCancelled?: boolean) {
    const o = {} as any
    Object.keys(hours).forEach((k: string) => {
        let a = []
        hours[k].forEach((i) => {
            let message = i.message.message || i.message  as Message
            let user = message.forward_origin || message.from
            let name
            // console.log({message})
            switch (message.type) {
                case "hidden_user":
                    name = user.sender_user_name
                    break;
                case "user":
                    user = user.sender_user
                    name = user.first_name || user.username || user.last_name
                    break
            }

            if (user?.first_name && user?.last_name) {
                name = `${user.first_name} ${user.last_name}`
            } else {
                if (user.last_name) {
                    name = user.last_name
                }
                if (user.first_name) {
                    name = user.first_name
                }
            }

            let url = ''
            switch (message.chat.type) {
                case "supergroup":
                    url = `https://t.me/c/${message.chat.id * -1 - 1000000000000}/${message.message_id}`
                    break
            }
            const u = {
                pos: parseInt(i.pos),
                name,
                url
            } as any
            if (user.username) {
                u.username = user.username
            }
            if (isCancelled) {
                u.isCancelled = true
            }
            a.push(u)
        })
        o[k] = a
    })
    return o
}

function dailySchedule(ds: DailySchedule) {
    const {title, events, override} = ds
    return {title, events, override}
}

export const frontParse = {
    userHours,
    dailySchedule
}