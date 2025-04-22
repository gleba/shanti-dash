import { isProd } from './constatnts.ts'
import { DB } from './db.ts'
import { classifyMessageText } from './parser.сlassifier.ts'
import { registrationAction } from './registration.action.ts'
import { schedules } from './schedules.ts'
import { timeAction } from './parser.time.action.ts'
import { formatMessageUrl, formatUser, getUserName } from './state.front.ts'
import sql from './db_stats.ts'
import crypto from "crypto";

const prodChat = -1001646592889
const devChat = prodChat

// const devChat = -1002470999811

interface PeopleInHistory {
  id: number
  url: string
  label: string
  isCancel: boolean
}

interface EventInHistory {
  time: string
  title: string
  people: PeopleInHistory[]
}

interface DayInHistory {
  id: number
  title: string
  date: string
  events: Record<string, EventInHistory>
  mistakes: any[]
}

const makeUrl = (message: any) =>
  `https://t.me/c/${message.groupId * -1 - 1000000000000}/${message.id}`

const peoples = {}

const addAttendance = async (
  message_id: number,
  user_id: number,
  event_date: string,
  event_time: string,
  status: string,
  text: string,
) => {
  await sql`INSERT INTO attendance ${sql({ message_id, user_id, event_date, event_time, status, text })}
            ON CONFLICT (message_id)
  DO NOTHING;`
}
const addEvent = async (
  message_id: number,
  date: string,
  time: string,
  title: string,
) => {
  await sql`INSERT INTO events ${sql({ message_id, date, time, title })}
            ON CONFLICT (date, time) DO NOTHING;`
}

const lastUserHash = {} as any
const updateUser = async (user_data:any) => {
  const userDataText = JSON.stringify(user_data);
  const user_id = user_data.id
  const prevHash = lastUserHash[user_id]
  const hash = crypto.createHash("sha1").update(userDataText).digest("hex");
  if (prevHash && prevHash == hash) {
    return
  }
  lastUserHash[user_id] = hash
  await sql`INSERT INTO user_info ${sql({ user_id, user_data, hash })}
            ON CONFLICT (user_id) 
            DO UPDATE SET
            user_data = EXCLUDED.user_data,
            hash = EXCLUDED.hash`
}
const historicalDays = {}
let currentDay: DayInHistory

export async function historicalMessage(msg: any, messageType: string) {
  const messageId = msg.from?.id as number
  updateUser(msg.from)

  switch (messageType) {
    case 'other':
      if (currentDay?.mistakes) {
        currentDay.mistakes.push({
          id: messageId,
          text: msg.text,
          url: makeUrl(msg),
          label: getUserName(msg),
        })
      }
      if (currentDay?.date) {
        addAttendance(
          msg.message_id,
          messageId,
          currentDay.date,
          'Null',
          'noise',
          msg.text,
        )
      }
      break
    case 'registrationNew':
    case 'registrationCancel':
      const action = timeAction(msg.text as any)
      const ra = { action, message: msg } as any
      if (currentDay?.events[action.time]) {
        currentDay.events[action.time].people.push({
          id: msg.from?.id,
          isCancel: action.isCancel,
          url: formatMessageUrl(ra),
          label: formatUser(ra),
        } as any)
        addAttendance(
          msg.message_id,
          messageId,
          currentDay.date,
          action.time,
          action.isCancel ? 'cancel' : 'reg',
          msg.text,
        )
      }
      break
    case 'scheduleNew':
      const date = new Date(msg.date * 1000).toISOString().split('T')[0]
      // console.log(messageType, date)
      const sh = DB.schedule.get(prodChat, msg.message_id)
      if (sh?.events) {
        if (currentDay) {
          const resp = await sql`INSERT INTO historical_day ${sql({
            message_id: msg.message_id, 
            date: currentDay.date,
            day: currentDay,
          })} ON CONFLICT (date) DO NOTHING;
`
          console.log(currentDay.date, currentDay.title, resp)
        }
        const events = {} as Record<string, EventInHistory>
        Object.keys(sh?.events).forEach((t) => {
          const { title, time } = sh.events[t]
          events[t] = {
            title,
            time,
            people: [],
          }
          addEvent(messageId, date, time, title)
          // console.log("::::", date, time, title, title)
        })
        currentDay = {
          id: messageId,
          date,
          title: sh.title,
          events,
          mistakes: [],
        }
      }
      break
    case 'scheduleUpdate':
    // break
    case 'scheduleCancel':
      break
    default:
  }
}

export function historySync() {
  console.log('start history sync')
  const allMessages = DB.messages.all(isProd ? prodChat : devChat)
  allMessages.forEach((msg) => {
    const messageType = classifyMessageText(msg.text)
    historicalMessage(msg, messageType)
  })
  console.log('start history complete')
}
