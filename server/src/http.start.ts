import {file, serve} from "bun";
import {websocket} from "./http.ws.ts";
import {routes} from "./http.routes.ts";

const isProd = process.env.NODE_ENV = "production";

const STATIC_DIR = isProd ? "/dist" : "./dist"; // Каталог со статикой


const indexFile = file(`${STATIC_DIR}/index.html`)
const s = serve({
    port: 3000,
    async fetch(req, server) {
        const url = new URL(req.url);
        const [, api, cmd, id] = url.pathname.split("/"); // Получаем путь
        if (api == 'api') {
            const handler = routes[cmd]
            if (handler) {
                return handler(id)
            }
        }

        // Обрабатываем WebSocket соединение
        if (url.pathname === "/ws") {
            const success = server.upgrade(req, {
                data: {username: "anonymous"}, // Передача данных в WebSocket
            });
            return success ? undefined : new Response("WebSocket upgrade failed", {status: 400});
        }

        // Раздаем статические файлы
        const filePath = `${STATIC_DIR}${url.pathname}`;
        const staticFile = file(filePath);

        if (await staticFile.exists()) {
            return new Response(staticFile);
        }

        // Если путь не существует, но это не WebSocket, отдаем `index.html` (SPA поддержка)
        return new Response(indexFile);
    },
    websocket, // WebSocket обработчики
})

console.log("http server start on port ", s.port)
