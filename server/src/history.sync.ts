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


// const makeMessageUrl = (message: any) =>
//   `https://t.me/c/${message.groupId * -1 - 1000000000000}/${message.id}`

const makeMessageUrl = (message: any) =>
  `https://t.me/c/${message.chat.id * -1 - 1000000000000}/${message.message_id}`


const addAttendance = async (
  message_id: number,
  user_id: number,
  event_date: string,
  event_time: string,
  status: string,
  text: string,
  timestamp:Date
) => {
  console.log("INSERT INTO attendance", event_date, event_time, status, text, timestamp)
  const res = await sql`INSERT INTO attendance ${sql({ message_id, user_id, event_date, event_time, status, text, timestamp })}
            ON CONFLICT (message_id)
  DO NOTHING;`
  console.log(res)
}
const addEvent = async (
  message_id: number,
  date: string,
  time: string,
  time_end: string,
  title: string,
  timestamp:string
) => {
  console.log("history event", date, time)
  await sql`INSERT INTO events ${sql({ message_id, date, time, time_end, title, timestamp})}
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
  const messageDate = new Date(msg.date * 1000)
  const timestamp = messageDate.toISOString()
  updateUser(msg.from)
  const userName = getUserName(msg.from)
  switch (messageType) {
    case 'none':
    case 'other':

      if (currentDay?.date) {
        addAttendance(
          msg.message_id,
          messageId,
          currentDay.date,
          'Null',
          messageType,
          msg.text,
          messageDate,
        )
      }
      break
    case 'registrationNew':
    case 'registrationCancel':
      const action = timeAction(msg.text as any)
      const ra = { action, message: msg } as any
      const messageUrl = makeMessageUrl(msg)

      let actionTime = action.time
      if (action.isCancel && !actionTime && msg.reply_to_message?.text) {
        actionTime = timeAction(msg.reply_to_message?.text).time
      }

      console.log(messageId, messageType, actionTime)
      if (actionTime && currentDay?.events[actionTime]) {

        const peopleId = msg.from?.id
        const people = {
          url: messageUrl,
          label: userName,
        } as any


        if (!action.isCancel) {
          people.pos = action.pos
          currentDay.events[actionTime].people[peopleId] = people
        } else if(currentDay.events[actionTime].people[peopleId]){
          currentDay.events[actionTime].people[peopleId].url = messageUrl
          currentDay.events[actionTime].people[peopleId].isCancel = true
        } else {
          currentDay.mistakes.push({
            text: msg.text,
            ...people
          })
        }


        await addAttendance(
          msg.message_id,
          messageId,
          currentDay.date,
          actionTime,
          action.isCancel ? 'cancel' : 'reg',
          msg.text,
          messageDate,
        )
      } else {
        if (currentDay?.mistakes) {
          currentDay.mistakes.push({
            text: msg.text,
            url: messageUrl,
            label: userName,
          })
        }
      }
      break
    case 'scheduleNew':

      const plusOneDay = new Date(messageDate);
      plusOneDay.setDate(plusOneDay.getDate() + 1);

      const date = plusOneDay.toISOString().split('T')[0]
      // console.log(messageType, date)
      const sh = DB.schedule.get(prodChat, msg.message_id)
      if (sh?.events) {
        console.log("scheduleNew", sh.title)

        if (currentDay) {
          const resp = await sql`INSERT INTO historical_day ${sql({
              message_id: msg.message_id,
              date: currentDay.date,
              day: currentDay,
              timestamp: currentDay.timestamp,
          })} ON CONFLICT (date) DO NOTHING;`
          console.log("::::::: INSERT INTO historical_da", currentDay.date, currentDay.title, ...resp)
        }
        const events = {} as Record<string, EventInHistory>
        for (const t in sh.events) {
          const { title, time } = sh.events[t]
          const [timeStart, timeEnd] = time.split("-")
          events[t] = {
            title,
            time:timeStart,
            time_end:timeEnd,
            people: {},
          }
          await addEvent(messageId, date, timeStart, timeEnd, title, messageDate)
        }
        currentDay = {
          timestamp,
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

export async function historySync() {
  console.log('start history sync')
  const allMessages = DB.messages.all(isProd ? prodChat : devChat)
  //const users = await sql`SELECT (user_id, hash) from public.user_info`.values()
  // console.log('users', users)
  for (const msg of allMessages) {
    const messageType = classifyMessageText(msg.text)
    await historicalMessage(msg, messageType)
  }
  console.log('start history complete')
}
