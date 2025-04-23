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
function getDateRange(interval:string) {
    const end = new Date()
    const start = new Date();
    switch(interval) {
        case "week":
            start.setDate(end.getDate() - 7);
            break;
        case "month":                                 // 2025-03-31
            start.setDate(end.getDate() - 30);
            break;
        case "quarter":                                    // 2025-03-31
            start.setDate(end.getDate() - 90);
            break;
    }
    return {
        start: start.toISOString().split('T')[0],
        end: end.toISOString().split('T')[0],
    };
}

export const routes = {

    async"state"(event:string, interval:string) {
        const dates = getDateRange(interval);

        const res = await sql`SELECT
                                  COUNT(*) AS event_count,
                                  u.user_data
                              FROM attendance a
                                       LEFT JOIN user_info u ON a.user_id = u.user_id
                              WHERE
                                  a.status = ${event}  -- Замените на нужный статус
                                AND a.event_date BETWEEN ${dates.start} AND ${dates.end}
                              GROUP BY a.user_id, u.hash, u.user_data
                              ORDER BY event_count DESC
                              LIMIT 100;`
        return response(JSON.stringify(res))
    },

    async "user-info"(userId:string) {

        const [{ result }] = await sql`SELECT COALESCE(
                                                json_agg(t)->>0 , '[]'
                                              )::text AS result
                                       FROM (
                                                SELECT
                                                    u.user_data,
                                                    COUNT(*) FILTER (WHERE a.status = 'reg') AS reg_count,
                                                    COUNT(*) FILTER (WHERE a.status = 'cancel') AS cancel_count,
                                                    COUNT(*) FILTER (WHERE a.status = 'none') AS none_count,
                                                    MAX(a.event_date) AS last_event_date,
                                                    (
                                                        SELECT text
                                                        FROM attendance a2
                                                        WHERE a2.user_id = ${parseInt(userId)}                                                       
                                                        LIMIT 1
                                                    ) AS last_message
                                                FROM user_info u
                                                         LEFT JOIN attendance a ON u.user_id = a.user_id
                                                WHERE u.user_id = ${parseInt(userId)}
                                                GROUP BY u.user_id, u.hash, u.user_data
                                            ) t;`
        return response(result);
    },
    async "user"(userId:string, event:string, interval:string) {
        const dates = getDateRange(interval);
        const   [{ result }]   = await sql`SELECT COALESCE(
                                            json_agg(t), '[]'
                                          )::text AS result
                                   FROM (
                                            SELECT
                                                e.date,
                                                json_agg(
                                                  json_build_object(
                                                    'time', e.time,
                                                    'title', e.title,
                                                    'text', a.text,
                                                    'message_id', a.message_id
                                                  )
                                                  ORDER BY e.time
                                                ) AS events
                                            FROM public.events e
                                                     JOIN public.attendance a
                                                          ON e.date = a.event_date AND e.time = a.event_time
                                            WHERE a.user_id = ${parseInt(userId)}
                                              AND a.status = ${event}
                                              AND e.date BETWEEN ${dates.start} AND ${dates.end}
                                            GROUP BY e.date
                                            ORDER BY e.date
                                        ) t;
        `;
        return response(result);
    },

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