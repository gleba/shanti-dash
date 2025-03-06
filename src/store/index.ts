import {defineStore} from 'pinia'
import {computed, ref, watch} from "vue";
import {Atom, Nucleus, saved} from "alak";
import {vueNucleon} from "@alaq/vue";


const fetcher = (...patch): Promise<any> =>
    new Promise(done =>
        // fetch('https://x.caaat.ru/api/' + patch.join('/'))
        fetch('http://localhost:3000/api/' + patch.join('/'))
            .then(res => {
                res.json().then(done)
            })
    )

class AtomicModel {
    chats = saved()
    selected = saved()
    data = saved()
    activeData: any
    registrationData: any
}

export const scheduleAtom = Atom({
    model: AtomicModel
})
const {core, state} = scheduleAtom

fetcher("chats")
    .then(v => {
        //@ts-ignore
        const c = Object.values(v).map(i => ({value: i.id, label: i.title}))
        core.chats(c)
        // console.log(":::::core.selected.isEmpty", core.selected.isEmpty)
        if (c.length > 0 && core.selected.isEmpty) core.selected(c[0].value)
    })


core.selected.upSome(groupId => {
    fetcher("active", groupId).then(v => {
        core.chats.mutate(c => {
            //@ts-ignore
            c[0].label = v.title
            return c
        })
        core.activeData(v.events)
    })
    fetcher("registration", groupId).then(core.registrationData)
})

Nucleus
    .from(core.activeData, core.registrationData)
    .some((a, r) => {
        const data = {}
        for (const time in a) {

            if (!r.active[time]) {
                return
            }
            const aum = {}
            r.active[time].forEach(i => {
                if (!aum[i.pos]) {
                    aum[i.pos] = i
                }
            })

            //@ts-ignore
            a[time].participantsList = Object.values(aum).sort((a, b) => a.pos - b.pos)
            a[time].participantsActiveCount = a[time].participantsList.length
            a[time].participantsCanceled = r.canceled[time]
        }
        core.data(a)
        return true
    })