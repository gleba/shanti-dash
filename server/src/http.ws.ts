import type {ServerWebSocket} from "bun";

interface WsData {
    rune:string
}


export const websocket = {
    open(ws: ServerWebSocket<WsData>){

        console.log("WebSocket connected")
        // ws.send("Welcome to Telegram Mini App!");
    },
    message(ws: ServerWebSocket, message: string) {
        console.log("Received:", message);
        // ws.send(`Echo: ${message}`);
    },
    close(ws: ServerWebSocket) {
        console.log("WebSocket disconnected");
    },
};
