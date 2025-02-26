import {atomicState} from "./state.atomic.ts";
const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "5"
}
const response = (v) => {
    return new Response(
        v ? v : JSON.stringify({ message: "Not found" }),
        {
            status: v ? 200 : 404,
            headers
        }
    );
};

export const routes = {
    "chats"() {
        return response(JSON.stringify(atomicState.chats))
    },
    "registration"(id) {
        return response(atomicState.groups[id].state.respRegistrations)
    },
    "active"(id) {
        return response(atomicState.groups[id].state.respSchedule)
    }
} as any