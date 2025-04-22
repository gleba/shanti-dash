import WsClient from '@alaq/ws'

import { systemAtom } from './AtomicModelSystem.ts'
import { scheduleAtom } from './AtomicModelSchedule.ts'
import { historyAtom } from './AtomicModelHistory.ts'

const ws = WsClient({
  // url: "http://localhost:3000/api/ws",
  url: 'https://x.caaat.ru/api/ws',
  reconnect: true,
  recConnectIntensity: 1,
})
ws.isConnected.up((v) => {
  systemAtom.core.connected(true)
  v &&
    ws.send({
      event: 'sync.schedule',
      data: {
        schedule: scheduleAtom.state.schedule?.sum || '',
        registrations: scheduleAtom.state.registrations?.sum || '',
      },
    })
})

const syncModel = {
  schedule: scheduleAtom,
  history: historyAtom,
  system: systemAtom,
}

ws.data.up((data: string) => {
  if (data.startsWith('sync')) {
    const atomName = data.split('.')[1]
    const atom = syncModel[atomName]
    if (data.ok) {
      atom.core[data.id](data)
    } else {
      atom.core.errors([data, ...atom.state.errors])
    }
  }
})
const connection = {
  requestHistoryFor(){

  }
}

export default connection