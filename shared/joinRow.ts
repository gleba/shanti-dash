//@ts-nocheck
//@ts-ignore



export function joinRow(s: any, r: any) {

    const {active, canceled} = r
    const events = {}
    const apply = (time, e: any) => {
        if (active[time]) {
            const users = {}
            const errors = []
            active[time].forEach(i => {
                if (!users[i.pos]) {
                    users[i.pos] = i
                } else {
                    errors.push(i)
                }
            })
            console.log(e)
            e.participantsList = Object.values(users).sort((a, b) => a.pos - b.pos)
            e.participantsActiveCount = e.participantsList?.length
            e.participantsCanceled = canceled[time]
            e.participantsErrors = errors
        } else {
            e.participantsActiveCount = "-"
        }
        e.key = Math.random().toString()
        events[time] = e
    }
    Object.keys(s.events).forEach(t => apply(t, s.events[t]))
    s.override && Object.keys(s.override).forEach(t => apply(t, s.override[t]))
    return events
}