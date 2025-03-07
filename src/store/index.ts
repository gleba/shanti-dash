//@ts-nocheck

import {defineStore} from 'pinia'
import {Atom, Nucleus, saved} from "alak";
import WsClient from "@alaq/ws";


// fetch('https://x.caaat.ru/api/' + patch.join('/'))

const ws = WsClient({
    url: "http://localhost:3000/api/ws",
})


class AtomicModel {
    connected: boolean
    chats = saved()
    selected = saved()
    events: any
    title: string
    schedule: any = saved()
    registrations: any = saved()
}

export const scheduleAtom = Atom({
    model: AtomicModel
})
const {core, state} = scheduleAtom

ws.isConnected.up(v => {
    core.connected(v)
    ws.send({
        event: "sync",
        schedule: state.schedule.sum,
        registrations: state.registrations.sum,
    })
})
ws.data.up(data => {
    core[data.id](data)
})

Nucleus
    .from(core.schedule, core.registrations)
    .some((s, r) => {
        const {events} = s.data
        core.title(s.data.title)
        for (const time in events) {
            if (!r?.data?.active[time]) {
                return
            }
            const aum = {}
            r.data.active[time].forEach(i => {
                if (!aum[i.pos]) {
                    aum[i.pos] = i
                }
            })

            //@ts-ignore
            events[time].participantsList = Object.values(aum).sort((a, b) => a.pos - b.pos)
            events[time].participantsActiveCount = events[time].participantsList.length
            events[time].participantsCanceled = r.data.canceled[time]
        }
        core.events(events)
        return true
    })