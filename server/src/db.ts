import {Database} from "bun:sqlite";
import path from "node:path";
import {Message} from "@grammyjs/types";
import {isProd} from "./constatnts.ts";

const DB_DIR = process.env.DB_DIR || "./database";
const db = new Database(path.resolve(DB_DIR, "ds.sqlite"), {create: true});

type TableKeyValueTRow = {
    id: number,
    group_id: number,
    value: string,
    timestamp: number
}

// @formatter:off
const sqlCreateKVTable = (name:any) => `
    CREATE TABLE IF NOT EXISTS ${name} (    
        id INTEGER NOT NULL,
        group_id INTEGER NOT NULL,
        value TEXT NOT NULL,
        timestamp INTEGER NOT NULL,
        PRIMARY KEY (group_id, id)
    )
`
const sqlUpdateKVTable = (name:any) => `INSERT INTO ${name} (group_id, id,  timestamp, value) VALUES (?, ?, ?, ?)`


const nowTimestamp = () => Math.floor(Date.now() /100)

function getTimestampDaysAgo(daysAgo : number) {
    const now = new Date();
    console.log(now.getHours())
    now.setHours(0, 0, 0, 0);
    const threeDaysAgo = now.getTime() - daysAgo * 24 * 60 * 60 * 1000;
    return Math.floor(threeDaysAgo / 1000);
}

const refreshTime = isProd ? 16 : 19
function getLastEventTimestamp(){
    const now = new Date();
    if (now.getHours()<refreshTime){
        now.setTime(now.getTime() - 24 * 60 * 60 * 1000 )
    }
    now.setHours(refreshTime-1, 30, 0, 0);
    return Math.floor(now.getTime() / 1000)
}

class KVTable<T> {
    // Создает таблицу для хранения key-value данных определенного типа T
    constructor(public name: string) {
        // console.log(sqlCreateKVTable(name))
        db.run(sqlCreateKVTable(name));
    }
    // Добавляет значение с явным указанием всех параметров
    addValue(id :number, group_id :number, timestamp:number, value :any) {
        db.run(sqlUpdateKVTable(this.name), group_id, id, timestamp, value)
    }
    // Добавляет значение по ключу сообщения из Telegram
    addValueFromMessage(msx:Message, value :T) {
        //@ts-ignore
        db.run(sqlUpdateKVTable(this.name),  msx.chat.id, msx.message_id, msx.forward_date || msx.date, JSON.stringify(value))
    }
    // Получает все значения за последние N дней для указанной группы
    lastEvent(group_id:number) {
        const lastEventTimestamp = getLastEventTimestamp();
        console.log("lastEventTimestamp", lastEventTimestamp,  new Date(lastEventTimestamp*1000).toLocaleString())
        return db
            .query(`SELECT value FROM ${this.name} WHERE timestamp >= ? AND group_id = ? ORDER BY timestamp `,)
            .all(lastEventTimestamp, group_id)
            .map((row:any) => JSON.parse(row.value) as T);
    }    // Получает все значения за последние N дней для указанной группы
    getValuesFromLastDays(group_id:number, lastDays:number) {
        const timestampThreeDaysAgo = getTimestampDaysAgo(lastDays);
        return db
            .query(`SELECT value FROM ${this.name} WHERE timestamp >= ? AND group_id = ? ORDER BY timestamp `,)
            .all(timestampThreeDaysAgo, group_id)
            .map((row:any) => JSON.parse(row.value) as T);
    }
    delete(msx:Message) {
        db.query(`DELETE FROM ${this.name} WHERE group_id = ? AND id = ?`)
            .run(msx.chat.id, msx.message_id);
    }
    upsert(msx:Message, value :T) {
        db.query(`
            INSERT INTO ${this.name} (id, group_id, value, timestamp) 
                VALUES (?, ?, ?, ?) 
                ON CONFLICT(id, group_id) 
                DO UPDATE SET         
                    value = excluded.value`)
            .run(msx.message_id, msx.chat.id, JSON.stringify(value), nowTimestamp())
    }

    updateMsx(msx:Message, value :T) {
        this.update(msx.message_id, msx.chat.id, value)
    }

    update(id:number, group:number, value :T) {
        db
            .query(`UPDATE ${this.name} SET value = ? WHERE id = ? AND group_id = ?`)
            .run(JSON.stringify(value), id, group)
    }

    getFromMsx(msx:Message) {
        return this.get(msx.chat.id, msx.message_id);
    }
    get(group_id:number, id:number): T {
        const row = db.query(`SELECT value FROM ${this.name} WHERE group_id = ? AND id = ? LIMIT 1;`)
            .get(group_id, id) as any
        if (row){
            return JSON.parse(row.value);
        } else {
            return undefined as any;
        }
    }
    all(group_id:number): T[] {
        return  db
            .query(`SELECT value FROM ${this.name} WHERE group_id = ? ;`)
            .all(group_id)
            .map(row => JSON.parse(row.value));
    }
    allRaw(group_id:number): T[] {
        return  db
            .query(`SELECT * FROM ${this.name} WHERE group_id = ? ;`)
            .all(group_id)
            .map(row => {
                row.value=JSON.parse(row.value)
                return row
            });
    }
}






export const DB = {
    db,
    messages: new KVTable<Message>("raw_messages"),
    overrides: new KVTable<DailySchedule>("overrides"),
    schedule: new KVTable<DailySchedule>("schedule"),
    // registrations: new KVTable<any>("registrations")
}
