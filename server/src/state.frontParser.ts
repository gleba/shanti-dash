//@ts-nocheck
import {Message} from "@grammyjs/types";

function userHours(hours: HourlyRegistrations<Message>, isCancelled?: boolean) {
    const o = {} as any
    Object.keys(hours).forEach((k: string) => {
        let a = []
        hours[k].forEach((i: Message) => {
            let user = i.forward_origin || i.from
            let name
            switch (user.type) {
                case "hidden_user":
                    name = user.sender_user_name
                    break;
                case "user":
                    user = user.sender_user
                    name = user.first_name || user.username || user.last_name
                    break
            }

            if (user.first_name && user.last_name) {
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
            switch (i.chat.type) {
                case "supergroup":
                    url = `https://t.me/c/${i.chat.id * -1 - 1000000000000}/${i.message_id}`
                    break
            }
            const u = {
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