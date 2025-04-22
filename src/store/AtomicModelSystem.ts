import { Atom, saved } from 'alak'

class AtomicModelSystem {
  connected: boolean
  errors = []
}

export const systemAtom = Atom({
  model: AtomicModelSystem,
})



