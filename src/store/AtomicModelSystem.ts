import { Atom, saved } from 'alak'

class AtomicModelSystem {
  connected: any
  errors = []
}

export const systemAtom = Atom({
  model: AtomicModelSystem,
})



