//@ts-nocheck

import {Atom, Nucleus, saved} from "alak";
import WsClient from "@alaq/ws";
import {joinRow} from "../../shared/joinRow.ts";


// fetch('https://x.caaat.ru/api/' + patch.join('/'))

const ws = WsClient({
    url: "http://localhost:3000/api/ws",
    //url: "https://x.caaat.ru/api/ws",
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
        console.log(data.id, data?.data)
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
        core.title(s.data.title)
        return joinRow(s.data, r.data)
    })
    .up(core.events)