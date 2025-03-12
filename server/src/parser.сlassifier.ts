import Classifier from 'ml-classify-text';
import {activeDataSet} from "./parser.middle.active.ts";

export const classifier = new Classifier();

const trainTypes = {
    scheduleCancel: [
        '‼️Уважаемые участники! В 18:00 занятие по Психологии с Юлией Наумовой не состоится. приносим свои извинения.‼️',
        '‼️Уважаемы участники на 11:05  часов занятие не состоится‼️',
        '‼️Уважаемые участники! Занятие по Кинезиотерапии в 12:30 не состоится ! ‼️'
    ],
    scheduleUpdate: [`❗️СЕГОДНЯ ❗️

18:00-20:00
🪷МАК - исследование
"Я И МОЙ ВНУТРЕННИЙ КОМПАС" с помощью метафорических ассоциативных карт
Ведет Инна( зал Игротеки)
💥регистрация открыта - 2 человека`,
    `Завтра 13 марта
🌀 19.00-20.30 онлайн разговорный клуб! 🗣️

Готовы пройти увлекательный квест и раскрыть секреты успешного общения? 🌟

На этой встрече вы погрузитесь в "Разговорный лабиринт", где каждый этап — это новая стратегия для эффективных диалогов!

🎯 Формат: Игра, упражнения и диалоги! Мы будем проходить лабиринт общения, где каждый из вас сможет развить свои навыки и получить массу положительных эмоций. 😃

🗣️ Ждем вас в нашем разговорном клубе — вместе сделаем общение увлекательным и эффективным!
https://t.me/+IAKK9fJk8LwzODQ6

Модерирует встречу Елена Троценко`


    ],
    other: [
        `Уважаемые участники!!! Внимательно смотрите список регистрации. На 18:30 уже 13 человек.`,
        `У меня все правильно, впереди меня только номер 2,так что я 3.`,
        `Ира 10 уже есть выше`,
        `А где регистрация на завтра?`,
    ],
    scheduleNew: activeDataSet,
    registrationNew: [
        `8:30-1`,
        `08-30 1 Лена`,
        `15.30-1`,
        `19.00-3`,
        `15.30-2`,
        `19.0-4`,
        `15_30_3  НН`,
        `15_30_3  НН`,
        `12.30-5
12:30-4`,
        `13:30 6-ребенок
13:30 7 -родитель
18.00-7`,
        `Людмила
8:30-10`,
`19:00 - 6 нов`,
`8.30-з`,
`Людмила
14.30-6
15.30-9`,
`15.00- 4 родитель
15.00- 5 ребенок
15.00- 6 ребенок`,
`Татьяна
15:00-9
17:00-3`,
`08-30 1 Лена`,
`15.30 - 1 возможно опаздание`,
`Татьяна
8:30-8
11:30-3
14:00-2`
    ],
        registrationCancel: [
`15 30 - 5 отмена`,
`15:30- 6 отмена`,
`17 30 - 6 отмена`,
`17:30-5 отмена`,
`14:00-7 отмена`,
`15.30- 3 отмена`,
`15:30-8 отмена`,
]
}
Object.keys(trainTypes).forEach(t=>{
    classifier.train(trainTypes[t], t)
})

type MessageTextTypes = keyof typeof trainTypes | "none";

export function classifyMessageText(text?: string): MessageTextTypes {
    if (text) {
        const p = classifier.predict(text)
        // console.log(p)
        if (p.length) {
            return p[0]?.label || "none"
        }
    }
    return "none"
}