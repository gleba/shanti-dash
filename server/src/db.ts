import {Database} from "bun:sqlite";
import path from "node:path";
import {Message} from "@grammyjs/types";

const DB_DIR = process.env.DB_DIR || "./database_files";
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


function getTimestampDaysAgo(daysAgo : number) {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const threeDaysAgo = now.getTime() - daysAgo * 24 * 60 * 60 * 1000;
    return Math.floor(threeDaysAgo / 1000);
}

class KVTable<T> {
    constructor(public name: string) {
        // console.log(sqlCreateKVTable(name))
        db.run(sqlCreateKVTable(name));
    }
    addValue(id :number, group_id :number, timestamp:number, value :any) {
        db.run(sqlUpdateKVTable(this.name), group_id, id, timestamp, value)
    }
    addValueFromMessage(msx:Message, value :T) {
        //@ts-ignore
        db.run(sqlUpdateKVTable(this.name),  msx.chat.id, msx.message_id, msx.forward_date || msx.date, JSON.stringify(value))
    }
    getValuesFromLastDays(group_id:number, lastDays:number) {
        const timestampThreeDaysAgo = getTimestampDaysAgo(lastDays);
        return db
            .query(`SELECT value FROM ${this.name} WHERE timestamp >= ? AND group_id = ? ORDER BY timestamp `,)
            .all(timestampThreeDaysAgo, group_id)
            .map((row:any) => JSON.parse(row.value) as T);
    }
    upsert(msx:Message, value :T) {
        db.query(`
            INSERT INTO ${this.name} (id, group_id, value) 
                VALUES (?, ?, ?) 
                ON CONFLICT(id, group_id) 
                DO UPDATE SET         
                    value = excluded.value`)
            .run(msx.message_id, msx.chat.id, JSON.stringify(value))
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
        return this.get(msx.message_id, msx.chat.id);
    }
    get(group_id:number, id:number): undefined | T {
        const row = db.query(`SELECT value FROM ${this.name} WHERE group_id = ? AND id = ? LIMIT 1;`)
            .get(group_id, id) as any
        if (row){
            return JSON.parse(row.value);
        } else {
            return undefined
        }
    }
}






export const DB = {
    db,
    messages: new KVTable<Message>("raw_messages"),
    overrides: new KVTable<any>("overrides"),
    state: new KVTable<any>("state"),
    registrations: new KVTable<any>("registrations"),
}
