
// Интерфейс для хранения ежедневного расписания группы
interface DailySchedule {
    id: number
    groupId: number
    title: string
    htmlText: string
    events: Record<string, SingleEvent>
    override: Record<string, SingleEvent>
}

type HourlyRegistrations<T> = Record<string, T[]>
type DailyRegistrations<T> = {
    id: number
    active: HourlyRegistrations<T>
    canceled: HourlyRegistrations<T>
}