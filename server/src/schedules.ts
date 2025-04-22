import {Message} from "@grammyjs/types";
import {DB} from "./db.ts";
import {parseBigDay} from "./parser.days.ts";
import {registrations} from "./registrations.store.ts";
import {timeAction} from "./parser.time.action.ts";
import {QuarkEventBus} from "alak";

import {restore} from "./telegram.messageHandler.ts";

const bus = QuarkEventBus() as IQuarkBus<Record<string, DailySchedule>, any>
const active = []
bus.addEverythingListener((id, data) => {
    active[id] = data
})

export const schedules = {
    bus,
    active,
    async new(msx: Message) {
        const id = msx.message_id
        const groupId = msx.chat.id
        registrations.resetForNewDay(groupId)
        let schedule = DB.schedule.get(groupId, id)
        if (!schedule || !Object.keys(schedule.events).length) {
            bus.dispatchEvent(groupId, {
                id,
                groupId,
                title: "...обработка",
                htmlText: "...обработка",
                events: {}
            })
            console.log("New schedule", groupId, id)
            const data = await parseBigDay(msx)
            schedule = Object.assign(data, {
                id,
                groupId
            })
            DB.schedule.upsert(msx, schedule)
            restore()
        } else {
            schedule && bus.dispatchEvent(groupId, schedule)
        }
    },
    async update(msx: Message) {
        let r = DB.overrides.getFromMsx(msx) as DailySchedule
        if (!r) {
            r = await parseBigDay(msx)
            DB.overrides.addValueFromMessage(msx, r)
        }
        const schedule = active[msx.chat.id]
        if (schedule){
            schedule.override = r.events
            bus.dispatchEvent(msx.chat.id, schedule)
        }
    },
    cancelTime(msx: Message) {
        if (msx.text) {
            const at = timeAction(msx.text)
            const schedule = active[msx.chat.id]
            if (schedule && at.time && schedule.events[at.time]) {
                schedule.events[at.time].canceled = true
                bus.dispatchEvent(msx.chat.id, schedule)
            }
            console.write("-")
        }
    }
}