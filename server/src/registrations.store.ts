import IndexedVertexMap from "./IndexedVertexMap.ts";
import {ITimeAction} from "./parser.time.action.ts";
import {SMessage} from "./registration.action.ts";
import {QuarkEventBus} from "alak";


export type RegAction = {
    action: ITimeAction
    message: SMessage
}
export type RegActionCanceled = {
    canceled: RegAction
} & RegAction

const newRegState = () => ({
    active: IndexedVertexMap<RegAction>(),
    cancel: IndexedVertexMap<RegActionCanceled>()
})

export type ChatRegistrations = ReturnType<typeof newRegState>
const registrationsStore = {} as Record<number, ChatRegistrations>
const get = (id: number) => {
    let state = registrationsStore[id]
    if (!state) {
        state = registrationsStore[id] = newRegState()
    }
    return state
}

const bus = QuarkEventBus() as IQuarkBus<Record<string, ChatRegistrations>, any>
bus.addEverythingListener((id, data) => {
    registrationsStore[id] = data
})
export const registrations = {
    get,
    bus,
    resetForNewDay(id: number) {
        bus.dispatchEvent(id, newRegState())
    }
}