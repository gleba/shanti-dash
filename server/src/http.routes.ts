// import {groupStates} from "./state.current.ts";
// import {activeDailyRecords, DailyRegistrations, DailySchedule, HourlyRegistrations} from "./DailySchedule.ts";


//
//
// function parseDallyRecords(dallyRecords: DailyRegistrations) {
//     const v = {}
//     let g
//     Object.keys(dallyRecords).forEach(gid => {
//         g = dallyRecords[gid]
//         v[gid] = parseActive(g.active)
//     })
//     return v
// }
// function parseGroupState(groupState: DailySchedule) {
//     return {
//         title: groupState.date,
//         events:groupState.events,
//         override: groupState.override
//     }
// }
//
// function parseGroupStates(gs: Record<number, DailySchedule>) {
//     const o = {}
//     for (const g in gs) {
//         o[g] =  parseGroupState(gs[g])
//     }
//     return o
// }

import {atomicState} from "./state.atomic.ts";

const response = (v) => {
    const r = v ? new Response(v) : Response.json({ message: "Not found" }, { status: 404 })
    r.headers.set("Content-Type", "application/json")
    r.headers.set("Access-Control-Allow-Origin", "*")
    r.headers.set("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE")
    r.headers.set("Access-Control-Allow-Headers", "Content-Type")
    r.headers.set("Access-Control-Max-Age", "5")
    return r
}
export const routes = {
    "chats"() {
        return Response.json(atomicState.chats)
    },
    "registration"(id) {
        return response(atomicState.groups[id].state.respRegistrations)
    },
    "active"(id) {
        return response(atomicState.groups[id].state.respSchedule)
    }
} as any