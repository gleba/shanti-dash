import {ITimeAction, timeAction} from "./parser.time.action.ts";
import {DB} from "./db.ts";
import {markMessage} from "./telegram.ts";
import {atomicState} from "./state.atomic.ts";


const newDallyRecord = (gs: DailySchedule): DailyRegistrations<any> => {
    const r: DailyRegistrations<any> = {
        id: gs.id,
        active: {},
        canceled: {}
    };
    Object.keys(gs.events).forEach(k => {
        r.active[k] = [];
        r.canceled[k] = [];
    });
    return r;
}

// export const activeDailyRecords = {} as Record<number, DailyRegistrations<any>>
export const getDallyRegistrations = (gs: DailySchedule) => {
    const ag = atomicState.groups[gs.groupId]
    let dr = ag.state.dailyRegistrations
    if (dr?.id === gs.id) {
        return dr
    }
    dr = DB.registrations.get(gs.id, gs.groupId)
    if (!dr) {
        dr = newDallyRecord(gs)
        ag.core.dailyRegistrations(dr)
    }
    return dr
}

const getUserId = (message:any) => message.forward_origin?.sender_user?.id || message.from.id

export const registrationAction = (gs: DailySchedule) => {
    const dr = getDallyRegistrations(gs)
    return (message: any, ta: ITimeAction) => {
        if (ta.isCancel) {
            let time = ta.time
            if (!time && message.reply_to_message) {
                time = timeAction(message.reply_to_message?.text).time
            }
            if (time && dr.active[time]) {
                let userId = getUserId(message)
                dr.active[time] = dr.active[time].filter(m => {
                    if (getUserId(m.message) != userId){
                        return true
                    } else {
                        dr.canceled[time].push({message:m, ta ,time})
                        return false
                    }
                })
                console.write("-")
                markMessage(message, "ok")
            } else {
                markMessage(message, "invalid")
                console.write("E")
            }
        } else {
            if (!dr.active[ta.time] && !Object.keys(dr.active).length) {
                dr.active[ta.time] = []
            }
            if (ta.time && dr.active[ta.time] && ta.pos) {
                // console.log(":::", message.message)
                dr.active[ta.time].push({message, ta})
                markMessage(message, "ok")
                console.write("+")
            } else {
                markMessage(message, "invalid")
                console.write("Ё")
            }
        }
        atomicState.groups[gs.groupId].core.dailyRegistrations(dr)

    }
}
