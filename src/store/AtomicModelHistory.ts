import { Atom, saved } from 'alak'

class AtomicModelHistory {
  connected: boolean
  errors = []
}

export const historyAtom = Atom({
  model: AtomicModelHistory,
})
