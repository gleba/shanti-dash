//@ts-nocheck
//@ts-ignore



export function joinRow(s: any, r: any) {
    const {events} = s
    const {active, canceled} = r
    for (const time in events) {
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
            events[time].participantsList = Object.values(users).sort((a, b) => a.pos - b.pos)
            events[time].participantsActiveCount = events[time].participantsList.length
            events[time].participantsCanceled = canceled[time]
            events[time].participantsErrors = errors
        } else {
            events[time].participantsActiveCount = "-"
        }
        events[time].key = Math.random().toString()
    }
    return events
}