import { Atom, saved, UnionModel } from 'alak'
import constants from './constants.ts'
import get from './get.ts'

class AtomicModelHistory {
  selectedDay: string = saved()
  currentData: DayInHistory = saved()
  list: string[] = []

}

export const historyAtom = Atom({
  model: AtomicModelHistory,
})

const {core} = historyAtom
core.selectedDay.up(day=>{
  get('history/'+day).then(core.currentData)
})

get("history-state").then(core.list)