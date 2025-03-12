import {RegAction, registrations} from "./registrations.store.ts";
import {frontData} from "./http.ws.ts";
import {schedules} from "./schedules.ts";


function getUserName(user: any) {
    let name = user.first_name || user.username || user.last_name || user.sender_user_name

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
    return name
}

const formatMessageUrl = (i: RegAction) => `https://t.me/c/${i.message.groupId * -1 - 1000000000000}/${i.message.id}`

const formatUser = (i: RegAction) => ({
    name: getUserName(i.message.from),
    url: formatMessageUrl(i),
    pos: i.action.pos,
    username: i.message.from.username
})

export function setupFrontState() {
    let active, canceled, u
    registrations.bus.addEverythingListener((id, r) => {
        active = {}
        r.active.forEachKeys((a, time) => {
            u = []
            a.forEach(i => {
                u.push(formatUser(i))
            })
            active[time] = u
        })
        canceled = {}
        r.cancel.forEachKeys((c, time) => {
            u = []
            c.forEach(i => {
                u.push(Object.assign(formatUser(i), {
                        canceledUrl: (formatMessageUrl(i.canceled))
                    }
                ))
            })
            canceled[time] = u
        })
        // console.log(active)
        frontData.respRegistrations({active, canceled})
    })

    schedules.bus.addEverythingListener((id, r) => {
        frontData.dailySchedule(r)
    })
}