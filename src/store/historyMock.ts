const schH = {
    "09:00": [],
    "13:00": [],
    "14:00": [],
    "16:00": [],
    "14:15": [],
    "17:15": [],
}

const historyMock = {
    time: Date.now(),
    title: "суббота 29 марта",
    schH: [] as any[],
    mistakes: [],
}

for (const t in schH) {
    const people = [] as any[]
    let peopleCount = Math.floor(Math.random() * 10)+1;
    while (peopleCount--) {
        people.push({
            id: 1,
            isCancel: Math.random() > 0.8,
        })
    }
    const day = {
        time: t,
        name: "название",
        people
    }
    historyMock.schH.push(day)
}
console.log(historyMock.schH)

const peopleMock = {
    1: {
        name: "имя",
        username: "юз"
    }
}

const peopleHistoryMock = [
    {
        title: "день дата",
        activities: [
            {
                time: "17:15",
                name: "название",
                isCancel: Math.random() > 0.8,
            }
        ]
    }
]

export { peopleMock, historyMock, peopleHistoryMock }