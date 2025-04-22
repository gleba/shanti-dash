interface PeopleInHistory {
  url: string
  pos?: string
  label: string
  isCancel: boolean
}

interface EventInHistory {
  time: string
  title: string
  people: Record<string, PeopleInHistory>
}

interface DayInHistory {
  id: number
  title: string
  date: string
  events: Record<string, EventInHistory>
  mistakes: any[]
}