//@ts-nocheck

import {Atom, Nucleus, saved} from "alak";
import WsClient from "@alaq/ws";


// fetch('https://x.caaat.ru/api/' + patch.join('/'))

const ws = WsClient({
    // url: "http://localhost:3000/api/ws",
    url: "https://x.caaat.ru/api/ws",
    reconnect:true,
    recConnectIntensity:1
})


class AtomicModel {
    connected: boolean
    chats = saved()
    selected = saved()
    events
    title: string
    schedule = saved()
    registrations = saved()
    errors = []
    time: number
}


export const scheduleAtom = Atom({
    model: AtomicModel
})
const {core, state} = scheduleAtom


// setInterval(()=>{
//     // state.time = Date.now()
//     core.time.mutate(t=>{
//         return Date.now()
//     })
// }, 100)
ws.isConnected.up(v => {
    core.connected(v)
    v && ws.send({
        event: "sync",
        data: {
            schedule: state.schedule?.sum || "",
            registrations: state.registrations?.sum || "",
        },
    })
})
ws.data.up(data => {
    if (data?.event === "sync") {
        if (data.ok) {
            core[data.id](data)
        } else {
            state.errors = [data, ...state.errors]
        }
    }
})

Nucleus
    .from(core.schedule, core.registrations)
    .some((s, r) => {
        console.log("some", s, r, core.events())
        const {events} = s.data
        core.title(s.data.title)
        for (const time in events) {
            if (r.data.active[time]) {
                const aum = {}
                r.data.active[time].forEach(i => {
                    if (!aum[i.pos]) {
                        aum[i.pos] = i
                    }
                })
                events[time].participantsList = Object.values(aum).sort((a, b) => a.pos - b.pos)
                events[time].participantsActiveCount = events[time].participantsList.length
                events[time].participantsCanceled = r.data.canceled[time]
            } else {
                events[time].participantsActiveCount = "-"
            }
            events[time] = Object.assign({}, events[time], {key: Math.random().toString()})
        }
        core.events(Object.assign({}, events))
        return true
    })