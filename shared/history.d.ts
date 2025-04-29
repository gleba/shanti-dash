interface PeopleInHistory {
  url: string
  pos?: string
  label: string
  isCancel: boolean
}

interface EventInHistory {
  time: string
  time_end: string
  title: string
  people: Record<string, PeopleInHistory>
}

interface DayInHistory {
  id: number
  title: string
  // timestamp: Date
  date: string
  events: Record<string, EventInHistory>
  mistakes: any[]
}