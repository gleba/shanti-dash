import { Atom, Nucleus, saved, UnionModel } from 'alak'
import constants from './constants.ts'
import get from './get.ts'

class AtomicModelUser {
  selectedId:any = saved()
  selectedTime: string = saved("week")
  selectedEvent: string = saved()
  currentData: any
  currentInfo: any
}

export const userAtom = Atom({
  model: AtomicModelUser,
})

const { core } = userAtom


userAtom.core.selectedId.up(id=>{
  // core.currentInfo(null)
  get(['user-info', id].join('/')).then(core.currentInfo)
})


Nucleus.from(core.selectedId, core.selectedEvent, core.selectedTime)
  .some((id, event, time) => {
    // core.currentData(null)
  get(['user', id, event, time].join('/')).then(core.currentData)
})
