
import {Atom, Nucleus, saved} from "alak";

import {joinRow} from "../../shared/joinRow.ts";


class AtomicModelSchedule {
  selected = saved("current")
  events
  title: any
  schedule:any = saved()
  registrations:any = saved()
  time: any
}


export const scheduleAtom = Atom({
  model: AtomicModelSchedule
})
const {core, state} = scheduleAtom


Nucleus.from(core.schedule, core.registrations)
  .some((s, r) => {
    core.title(s.data.title)
    return joinRow(s.data, r.data)
  })
  .up(core.events)