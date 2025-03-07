import {atomicState} from "./state.atomic.ts";
import crypto from 'crypto';

function calculateChecksumSync(obj, algorithm = 'md5') {
    return crypto.createHash(algorithm).update(JSON.stringify(obj)).digest('hex');
}

const clients = new Set();
const cache = {
    registrations: {},
    schedule: {}
}
const updateChane = (data: any, id: keyof typeof cache) => {
    const sum = calculateChecksumSync(data)
    cache[id] = {
        sum,
        json: JSON.stringify({
            data, sum, id
        })
    }
    broadcastMessage(cache[id])
}
export const frontData = {
    respRegistrations(data:any) {
        updateChane(data, "registrations")
    },
    dailySchedule(data:any) {
        updateChane(data, "schedule")
    }
}
export const websocket = {
    open(ws) {
        clients.add(ws);
        console.log("WebSocket connected, total clients:", clients.size);
    },

    message(ws, message) {
        const data = JSON.parse(message)
        if (data.event == "sync"){
            Object.keys(cache).forEach(key => {
                if (cache[key].sum != data[key].sum){
                    ws.send(cache[key].json)
                    console.log("sync", key)
                }
            })
        }
        // broadcastMessage(`User said: ${message}`);
    },

    close(ws) {
        clients.delete(ws);
        console.log("WebSocket disconnected, remaining clients:", clients.size);
    }
};

// Функция для отправки сообщения всем клиентам
export function broadcastMessage(message) {
    if (clients.size) {
        clients.forEach(client => {
            if (client.readyState === 1) {
                client.send(message);
            }
        });
        console.log(`Broadcast ${message} sent to ${clients.size} clients`);
    }
}