import {defineStore} from 'pinia'
import {computed, ref, watch} from "vue";
import {Nucleus} from "alak";


const fetcher = (...patch):Promise<any> =>
    new Promise(done =>
        fetch('https://x.caaat.ru/' + patch.join('/'))
            .then(res => {
                res.json().then(done)
            })
    )


export const useScheduleStore = defineStore('schedule', () => {
    const chats = ref()
    const selected = ref<any>()
    const selectedTitle = ref<any>()

    fetcher("chats")
        .then(v => {
            //@ts-ignore
            const c = Object.values(v).map(i => ({value: i.id, label: i.title}))
            chats.value = c
            if (c.length > 0) selected.value = c[0].value
        })

    const activeData = Nucleus()
    const registrationData = Nucleus()
    const data = ref({})
    Nucleus
        .from(activeData, registrationData)
        .some((a, r) => {
            for (const time in a) {
                if (!r.active[time]){
                    return
                }
                a[time].participantsActiveCount = r.active[time].length
                a[time].participantsList =  r.active[time]
                a[time].participantsCanceled =  r.canceled[time]
            }
            data.value = a
            return true
        })

    watch(selected, groupId => {
        data.value = {}
        fetcher("active", groupId).then(v => {
            selectedTitle.value = v.title
            activeData(v.events)
        })
        fetcher("registration", groupId).then(registrationData)
    })

    return {chats, selected, selectedTitle, data}
})