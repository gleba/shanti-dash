import WsClient from '@alaq/ws'

import { systemAtom } from './AtomicModelSystem.ts'
import { scheduleAtom } from './AtomicModelSchedule.ts'
import { historyAtom } from './AtomicModelHistory.ts'
import constants from './constants.ts'

const ws = WsClient({
  url: constants.API+"ws",
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

ws.data.up((v: { event:string, ok:boolean, data:any, sum:string , id:string}) => {
  console.log(v)
  if (v.event?.startsWith('sync')) {
    const atomName = v.event.split('.')[1]
    const atom = syncModel[atomName]
    if (atom) {
      if (v.ok) {
        atom.core[v.id](v)
        // console.log(v.id, v.data)
      } else {
        atom.core.errors([v, atom.state.errors])
      }
    } else {
      console.error("ATOM NOT FOUND", v)
    }
  }
})

const connection = {
  requestHistoryFor(){

  }
}

export default connection