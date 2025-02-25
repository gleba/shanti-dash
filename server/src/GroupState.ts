import {ChatCompletion} from "gigachat/interfaces";
import {Message} from "@grammyjs/types";
import {ITimeAction, timeAction} from "./parser.time.action.ts";
import {DB} from "./db.ts";
import {markMessage} from "./telegram.ts";

interface DataState {
    htmlText: string
    completion: ChatCompletion
}

export interface GroupState {
    id: number
    groupId: number
    title: string
    htmlText: string
    afterParse: boolean
    events: Record<string, SingleEvent>
    override: Record<string, SingleEvent>
}

export type RecordMessages = Message[]
export type HourlyRecords = Record<string, RecordMessages>
export type DallyRecord = {
    id: number
    active: HourlyRecords
    canceled: HourlyRecords
}
const newDallyRecord = (gs: GroupState) => {
    const r = {active: {}, canceled: {}} as DallyRecord
    Object.keys(gs.events).forEach(k => {
        r.active[k] = []
        r.canceled[k] = []
    })
    r.id = gs.id
    return r
}

export const activeDallyRecords = {} as Record<number, DallyRecord>
export const getDallyRecord = (gs: GroupState) => {
    let r = activeDallyRecords[gs.groupId]
    if (r?.id === gs.id) {
        return r
    }
    r = DB.registrations.get(gs.id, gs.groupId) || newDallyRecord(gs)
    activeDallyRecords[gs.groupId] = r
    return r
}


export const registrationAction = (gs: GroupState) => {
    const record = getDallyRecord(gs)
    return (message: Message, ta: ITimeAction) => {
        if (ta.isCancel) {
            let time = ta.time
            if (!time && message.reply_to_message) {
                 //@ts-ignore
                 time = timeAction(message.reply_to_message?.text).time
            }
            if (time) {
                record.active[time] = record.active[time].filter(m => m.message_id != m.message_id)
                markMessage(message, "ok")
            } else {
                markMessage(message, "invalid")
            }
        } else {
            if (ta.time && record.active[ta.time]) {
                record.active[ta.time].push(message)
                markMessage(message, "ok")
            } else {
                markMessage(message, "invalid")
            }
        }
        console.write("+")
    }
}