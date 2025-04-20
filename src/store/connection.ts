import WsClient from '@alaq/ws'

import { systemAtom } from './AtomicModelSystem.ts'

export default function connect() {
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
        event: 'sync',
        data: {
          schedule: state.schedule?.sum || '',
          registrations: state.registrations?.sum || '',
        },
      })
  })
  ws.data.up((data) => {
    if (data?.event === 'sync') {
      console.log(data.id, data?.data)
      if (data.ok) {
        core[data.id](data)
      } else {
        state.errors = [data, ...state.errors]
      }
    }
  })
}
