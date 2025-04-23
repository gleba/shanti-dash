import { Atom, Nucleus, saved } from 'alak'
import { scheduleAtom } from './AtomicModelSchedule.ts'

class AtomicModelSystem {
  tabs = {
    current: 'current',
    stats: 'топ',
    archive: 'Архив',
  }
  selectedTab: string = saved('current')
  connected: any
  errors = []
}

export const systemAtom = Atom({
  model: AtomicModelSystem,
})

const { core, state } = systemAtom

scheduleAtom.core.title.up((title) => {
  state.tabs.current = title
})
// Nucleus.from()
//   .some(ti=>{
//     core.tabs
//   })
//
//
//
// core.days([
//   {
//     value: 'current',
//     label: s.data.title,
//   },
//   {
//     value: 'archive',
//     label: 'Архив',
//   },
// ])