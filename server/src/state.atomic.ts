import {Atom} from "alak";
import {ChatFullInfo, Message} from "@grammyjs/types";
import {frontParse} from "./state.frontParser.ts";
import {bot, doublePos, notifyError} from "./telegram.ts";

const response = (v) => {
    return JSON.stringify(v)
}

const newGroup = (name: string) => {
    const model = {
        dailySchedule: null as any as DailySchedule,
        dailyRegistrations: null as any as DailyRegistrations<any>,
        respRegistrations: "",
        respSchedule: "",
        archive
    }
    const atom = Atom({
        model,
        name,
    })

    atom.core.dailyRegistrations.up((value) => {
        let tp
        for (const t in value.active) {
            tp = {}
            value.active[t].forEach(r=>{
                // console.log(r.ta.pos, t)
                if (r.ta?.pos && tp[r.ta?.pos]) {
                    doublePos(tp[r.pos],  r)
                } else {
                    tp[r.ta?.pos] = r
                }

            })
        }
        const active = frontParse.userHours(value.active)
        const canceled = frontParse.userHours(value.canceled, true)
        atom.core.respRegistrations(response({active, canceled}))
    })
    atom.core.dailySchedule.up((value) => {
        const schedule = frontParse.dailySchedule(value)
        atom.core.respSchedule(response(schedule))
    })

    function archive() {
        console.log("archive")
    }

    return atom;
}

type AtomicGroup = ReturnType<typeof newGroup>
const groups = {} as Record<number, AtomicGroup>
const chats = {} as Record<number, ChatFullInfo>
const groupsProxyHandler = {
    get(o: Record<number, AtomicGroup>, key: number) {
        if (key > 0 ) {
            return
        }
        let value = o[key];
        if (!value) {
            value = groups[key] = newGroup(key.toString());
            bot.api.getChat(key)
                .then(v => {
                    chats[key] = v
                })
                .catch(e => {
                    console.log("запрос инфы для чата ", key, "неудался");
                })
        }
        return value;
    }
} as any

// https://t.me/c/1646592889/17782/36271
// https://t.me/c/2470999811/194
export const atomicState = {
    groups: new Proxy(groups, groupsProxyHandler),
    chats
}



