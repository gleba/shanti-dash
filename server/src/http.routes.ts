import {groupStates} from "./state.current.ts";
import {activeDallyRecords, DallyRecord, GroupState, HourlyRecords} from "./GroupState.ts";


function parseActive(hours: HourlyRecords, isCancelled: boolean) {
    const o = {}
    Object.keys(hours).forEach((k: string) => {
        let a = []
        hours[k].forEach(i => {
            const user = i.forward_origin?.sender_user || i.from
            delete user.is_bot
            delete user.id
            if (isCancelled) {
                user.isCancelled = true
            }
            a.push(user)
        })
        o[k] = a
    })
    return o
}


function parseDallyRecords(dallyRecords: DallyRecord) {
    const v = {}
    let g
    Object.keys(dallyRecords).forEach(gid => {
        g = dallyRecords[gid as any] as DallyRecord
        v[gid] = parseActive(g.active)
    })
    return v
}
function parseGroupState(groupState: GroupState) {
    return {
        title: groupState.date,
        events:groupState.events,
        override: groupState.override
    }
}

function parseGroupStates(gs: Record<number, GroupState>) {
    const o = {}
    for (const g in gs) {
        o[g] =  parseGroupState(gs[g])
    }
    return o
}
export const routes = {
    "/data"() {

        return Response.json(parseGroupStates(groupStates))
    },
    "/activex"() {
        return Response.json(parseDallyRecords(activeDallyRecords))
    }
} as any