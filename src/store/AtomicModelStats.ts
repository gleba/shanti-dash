import { Atom, Nucleus, saved, UnionModel } from 'alak'
import constants from './constants.ts'
import get from './get.ts'

class AtomicModelStats {
  selectedTime: string = saved()
  selectedEvent: string = saved()
  currentData: any
}

export const statsAtom = Atom({
  model: AtomicModelStats,
})

const { core } = statsAtom

Nucleus.from(core.selectedEvent, core.selectedTime).some((event, time) => {
  // core.currentData(null)
  get(['state', event, time].join('/')).then(core.currentData)
})
