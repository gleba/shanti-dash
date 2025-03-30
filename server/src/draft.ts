// import "./http.start.ts"
// import {restore} from "./telegram.messageHandler.ts";
// import {setupFrontState} from "./state.front.ts";
//
// setupFrontState()
// restore()
import {DB} from "./db.ts";
import {classifyMessageText} from "./parser.сlassifier.ts";
import {timeAction} from "./parser.time.action.ts";

// function something(a){
//     console.log(":",4+a)
//     return 0
// }
// let Aww=[1,5,8]
// console.log(Aww.map(something))
//
// let Awww=something(1);
// console.log(Awww);
let msx = DB.messages.all(-1001646592889)
const history=[]
let currentDay={} as any
let sch

msx.forEach(m => {
    let timestamp=m.date*1000;
    let time=new Date(timestamp)
    // console.log(time.toLocaleString(), timestamp, dn)
    if (timestamp<1742054541000){
        return
    }

    switch (classifyMessageText(m.text)) {
        case "scheduleUpdate":
            sch=DB.schedule.get(m.chat.id, m.message_id)
            if (!sch) {
                // break
            }
            console.log("+")
            break
        case "scheduleNew":
            sch=DB.schedule.get(m.chat.id, m.message_id)
            if (!sch) {
                break
            }
            history.push(currentDay)

            currentDay={time,
            title: sch.title,
            active:{},
            cancel:{},
            mistakes:[],
            }
            console.log(time.toLocaleString(),Object.keys(sch?.events))
            Object.keys(sch?.events).forEach(k=>{
                currentDay.active[k]=[]
                currentDay.cancel[k]=[]
            })

            break
        case "registrationCancel":
        case "registrationNew":
            if (!currentDay.active) break
            let a=timeAction(m.text)
            if (!currentDay.active[a.time]){
                currentDay.mistakes.push(m.from.id)
                console.log(a.time, "!!!", m.text)
            } else {
                if (a.isCancel){
                    currentDay.cancel[a.time].push(m.from.id)
                } else {
                    currentDay.active[a.time].push(m.from?.id)
                }
            }
    }
});
console.log(history);
// // console.log(cancelUsers);
//     // const messageType = classifyMessageText(m.text)
//     // if (messageType === "registrationCancel") {
//     //     const userId = m.from?.id;
//     //     if (userId) {
//     //         if (topCancel[userId] !== undefined) {
//     //             topCancel[userId]++;
//     //         } else {
//     //             topCancel[userId] = 1;
//     //             users[userId] = m.from;
//     //         }
//     //     }
//     //     const time = timeAction(m.text);
//         // console.log(`Отмена регистрации в ${time}`);
// //     }
// // })
//
// // Подсчет сообщений для каждого пользователя
//
// // msx.forEach(m => {
// //     if (top[m.from?.id] != null) {
// //         top[m.from?.id] = top[m.from?.id] + 1
// //     } else {
// //         top[m.from?.id] = 0
// //         users[m.from?.id] = m.from
// //     }
// // })
//
// // Преобразуем объект в массив для сортировки
// const arrayTop = Object.keys(cancelUsers).map(id => ({
//     ...users[id],
//     cancelCount: cancelUsers[id] // Количество отмен
// }));
//
// // Сортируем по количеству отмен (по убыванию)
// arrayTop.sort((a, b) => b.cancelCount - a.cancelCount);
//
// // Выводим топ-10 по отменам
// console.log('Топ-10 пользователей по отменам регистрации:');
// console.log(arrayTop);
//
// // Объявление функции, которая просто выводит "+" в консоль
// const f = () => {
//     console.log("+")
//     return "some"
// }
// f()
// console.log(f())
// // Демонстрация работы с массивами и оператором spread
// const a = [1, 2, 3]
// const v = [...a]  // Создание копии массива a
// a[0] = 0  // Изменение первого элемента массива a
// // v[1] = 0  // Эта строка закомментирована, поэтому не выполняется
// console.log({a})  // Выводит измененный массив a
// console.log({v})  // Выводит неизмененную копию массива v
//
// // Вызов функции f
// f()
//
//
