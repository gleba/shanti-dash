import {Message} from "@grammyjs/types";
import {DB} from "./db.ts";

import parseTgMsgToHtml from "./parser.tgMsgToHtml.ts";
import {timeAction} from "./parser.time.action.ts";
import {notifyError} from "./telegram.ts";
// import {atomicState} from "./state.atomic.ts";

import {parserRT} from "./parser.rut.ts";

// async function newSchedule(msx: Message) {
//     const id = msx.message_id
//     const groupId = msx.chat.id
//     const {core} = atomicState.groups[groupId]
//     core.dailyRegistrations({
//         id: groupId,
//         active: {},
//         canceled: {}
//     })
//     // core.dailySchedule(null)
//     let schedule = DB.schedule.get(groupId, id)
//
//
//     if (!schedule || !Object.keys(schedule.events).length) {
//         // console.log("NS", Object.keys(schedule.events).length)
//         console.log("New schedule", groupId, id)
//         const data = await parseBigDay(msx)
//         schedule = Object.assign(data, {
//             id,
//             groupId
//         })
//         DB.schedule.upsert(msx, schedule)
//     }
//
//     core.dailySchedule(schedule)
//     core.archive()
//     console.write("@")
// }

// const currentSchedule = (groupId: number) => {
//     let g = atomicState?.groups[groupId]
//     return g?.state?.dailySchedule
// }

export const stateCurrent = {
    // newSchedule,
    // // currentSchedule,
    // async update(msx: Message) {
    //     let r = DB.overrides.getFromMsx(msx) as DailySchedule
    //     if (!r) {
    //         r = await parseBigDay(msx)
    //         DB.overrides.addValueFromMessage(msx, r)
    //     }
    //     currentSchedule(msx.chat.id) &&
    //     atomicState.groups[msx.chat.id].core.dailySchedule.mutate(gs =>
    //         Object.assign(gs, {override: r.events})
    //     )
    // },
    // cancelTime(msx: Message) {
    //     if (msx.text) {
    //         const at = timeAction(msx.text)
    //         if (currentSchedule(msx.chat.id) && at.time) {
    //             atomicState.groups[msx.chat.id].core.dailySchedule.mutate(gs => {
    //                     //@ts-ignore
    //                     if (gs.events[at.time]) {
    //                         gs.events[at.time].canceled = true
    //                     } else {
    //                         console.log('wrong cancelTime', at.time)
    //                     }
    //                     return gs
    //                 }
    //             )
    //         }
    //         console.write("-")
    //     }
    // },
}
