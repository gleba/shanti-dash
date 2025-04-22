import crypto from 'crypto'

function calculateChecksumSync(obj, algorithm = 'md5') {
  return crypto.createHash(algorithm).update(JSON.stringify(obj)).digest('hex')
}

const clients = new Set()
const cache = {
  registrations: {},
  schedule: {},
}
const updateCache = (data: any, id: keyof typeof cache) => {
  if (!data) {
    return
  }
  const sum = calculateChecksumSync(data)
  const json = JSON.stringify({
    event: 'sync',
    ok: true,
    data,
    sum,
    id,
  })
  cache[id] = {
    sum,
    json,
  }
  broadcastMessage(json)
}
export const frontData = {
  respRegistrations(data: any) {
    updateCache(data, 'registrations')
  },
  dailySchedule(data: any) {
    updateCache(data, 'schedule')
  },
}
export const websocket = {
  open(ws) {
    clients.add(ws)
    console.log('WebSocket connected, total clients:', clients.size)
  },

  message(ws, message) {
    const cmd = JSON.parse(message)

    if (cmd.event.startsWith('sync') && cmd.data) {
      switch (cmd.event.split('.')[1]) {
        case 'schedule':
          const syncState = {}
          Object.keys(cache).forEach((id) => {
            if (cache[id].sum != cmd.data[id].sum) {
              ws.send(cache[id].json)
              syncState[id] = true
            }
          })
          Object.keys(cmd.data).forEach((id) => {
            if (!cache[id]?.sum) {
              ws.send(
                JSON.stringify({
                  id,
                  ok: false,
                  event: 'sync',
                  error: 'нет данных для ' + id,
                })
              )
            }
          })
          break
        case 'history':

      }

    }

    // broadcastMessage(`User said: ${message}`);
  },

  close(ws) {
    clients.delete(ws)
    console.log('WebSocket disconnected, remaining clients:', clients.size)
  },
}

// Функция для отправки сообщения всем клиентам
export function broadcastMessage(message) {
  if (clients.size) {
    clients.forEach((client) => {
      if (client.readyState === 1) {
        client.send(message)
      }
    })
    console.log(`Broadcast to ${clients.size} clients`)
  }
}
