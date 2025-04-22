import sql from './db_stats.ts'

const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "5"
}
const response = (v) => {
    return new Response(
        v ? v : JSON.stringify({message: "Not found"}),
        {
            status: v ? 200 : 404,
            headers
        }
    );
}

export const routes = {
    // "chats"() {
    //     return response(JSON.stringify(atomicState.chats))
    // },
    // "registration"(id) {
    //     return response(atomicState.groups[id].state.respRegistrations)
    // },

    async "history-list"(day:string) {
        const [{ result }] = await sql`SELECT json_agg(date)::text AS result FROM historical_day`;
        return response(result);
    },
    async "history-state"(day:string) {
        const [{ result }] = await sql`SELECT to_json(ARRAY[
            MIN(date),
            MAX(date)
            ])::text AS result
                                       FROM historical_day;`;
        return response(result);
    },
    async history(day:string) {
        const [{ result }] = await sql`SELECT json_agg(day)->>0 AS result
                                       FROM historical_day
                                       where date = ${day}`;
        return response(result);
    }
} as any