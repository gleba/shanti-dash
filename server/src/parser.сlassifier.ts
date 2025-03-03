import Classifier from 'ml-classify-text';
import {activeDataSet} from "./parser.middle.active.ts";

export const classifier = new Classifier();


const cancel = [
    '‼️Уважаемые участники! В 18:00 занятие по Психологии с Юлией Наумовой не состоится. приносим свои извинения.‼️',
    '‼️Уважаемы участники на 11:05  часов занятие не состоится‼️',
    '‼️Уважаемые участники! Занятие по Кинезиотерапии в 12:30 не состоится ! ‼️'
];
const update = [`❗️СЕГОДНЯ ❗️

18:00-20:00
🪷МАК - исследование
"Я И МОЙ ВНУТРЕННИЙ КОМПАС" с помощью метафорических ассоциативных карт
Ведет Инна( зал Игротеки)
💥регистрация открыта - 2 человека`];


const other = [
    `Уважаемые участники!!! Внимательно смотрите список регистрации. На 18:30 уже 13 человек.`,
    `У меня все правильно, впереди меня только номер 2,так что я 3.`,
    `Ира 10 уже есть выше`
];

classifier.train(cancel, 'cancel');
classifier.train(update, 'update');
classifier.train(activeDataSet, 'active');
classifier.train(other, 'other');

type MessageTextTypes = "active" | "other" | "cancel" | "update" | "none";

export function classifyMessageText(text: string): MessageTextTypes {
    const p = classifier.predict(text)
    if (p.length) {
        return p[0]?.label || "none"
    }
    return "none"
}