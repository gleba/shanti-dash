import { serve, file, type ServerWebSocket } from "bun";

const STATIC_DIR = "./dist"; // Каталог со статикой

// Тип для WebSocket данных
type WebSocketData = {
    username?: string;
};

// Обработка WebSocket
const handleWebSocket = {
    open(ws: ServerWebSocket<WebSocketData>) {
        console.log("WebSocket connected");
        ws.send("Welcome to Telegram Mini App!");
    },
    message(ws: ServerWebSocket<WebSocketData>, message: string) {
        console.log("Received:", message);
        ws.send(`Echo: ${message}`);
    },
    close(ws: ServerWebSocket<WebSocketData>) {
        console.log("WebSocket disconnected");
    },
};

// Запуск сервера
serve({
    port: 3000,
    async fetch(req, server) {
        const url = new URL(req.url);

        // Обрабатываем WebSocket соединение
        if (url.pathname === "/ws") {
            const success = server.upgrade(req, {
                data: { username: "anonymous" }, // Передача данных в WebSocket
            });
            return success ? undefined : new Response("WebSocket upgrade failed", { status: 400 });
        }

        // Раздаем статические файлы
        const filePath = `${STATIC_DIR}${url.pathname}`;
        const staticFile = file(filePath);

        if (await staticFile.exists()) {
            return new Response(staticFile);
        }

        // Если путь не существует, но это не WebSocket, отдаем `index.html` (SPA поддержка)
        return new Response(file(`${STATIC_DIR}/index.html`));
    },
    websocket: handleWebSocket, // WebSocket обработчики
});

console.log("Server is running on http://localhost:3000");
