
import { SQL } from "bun";


const sql = new SQL({
    hostname: "x.caaat.ru",
    port: 5432,
    database: "sdash",
    username: "kitty",
    password:  "AAErPw0eZdWdGRIDJMAG58Nb", //process.env["POSTGRES_PASSWORD"] as string,
    max: 10
});

// Создание таблицы events
await sql`
    CREATE TABLE IF NOT EXISTS events (
            message_id BIGINT  NOT NULL,
            timestamp TIMESTAMP NOT NULL,
            date TEXT NOT NULL,
            time TEXT NOT NULL,
            time_end TEXT NOT NULL,
            title TEXT NOT NULL,
            PRIMARY KEY (date, time)
        )
`

// Создание таблицы attendance
await sql`
    CREATE TABLE IF NOT EXISTS attendance (
        message_id BIGINT PRIMARY KEY UNIQUE NOT NULL,
        timestamp TIMESTAMP NOT NULL,
        user_id BIGINT NOT NULL,
        event_date TEXT NOT NULL,
        event_time TEXT NOT NULL,
        status TEXT NOT NULL,
        text TEXT NOT NULL
    )
`

await sql`
    CREATE INDEX IF NOT EXISTS idx_attendance_user
        ON attendance(user_id)
`

// Создание таблицы historical_day
await sql`
    CREATE TABLE IF NOT EXISTS historical_day (
        timestamp TIMESTAMP NOT NULL,
        date TEXT PRIMARY KEY,
        message_id BIGINT,
        day JSONB
    )
`

// Создание таблицы user_info
await sql`
  CREATE TABLE IF NOT EXISTS user_info (
    user_id BIGINT PRIMARY KEY,
    hash text,  
    user_data JSONB
  )
`

export default sql
