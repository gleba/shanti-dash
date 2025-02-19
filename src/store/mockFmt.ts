interface ShEventFmt {
    time: string;
    title: string;
    id?: string;
    participantsCount?: number;
    description: string; // Может содержать HTML или Markdown разметку
}

interface ScheduleFmt {
    date: string;
    events: ShEventFmt[];
}

const scheduleThursday: ScheduleFmt = {
    date: '6 февраля',
    events: [
        {
            time: '08:30 - 10:00',
            title: 'Практика для тазобедренных суставов + "Сурья Намаскар"',
            participantsCount: 10,
            description: '<strong>Ведущий:</strong> Владислав<br>Регистрация открыта.',
        },
        {
            time: '11:30 - 13:00',
            title: 'Кинезиотерапия - укрепление мышечного корсета',
            participantsCount: 6,
            description: 'Показана при наличии протрузий, межпозвоночных грыж, кифозов и лордозов.<br><strong>Ведущая:</strong> Наталья Демченко<br>Регистрация открыта.',
        },
        {
            time: '15:30 - 17:00',
            title: 'Кундалини йога',
            participantsCount: 9,
            description: '<strong>Ведущая:</strong> Ольга Лощинская<br>Регистрация открыта.',
        },
        {
            time: '17:40 - 21:00',
            title: 'Трансформационная психологическая игра "ДОМ ДУШИ МОЕЙ"',
            participantsCount: 3,
            description: 'Запросы:<ul><li>Самооценка и принятие себя</li><li>Личные границы</li><li>Обиды и разочарования</li><li>Поиск истинных ценностей и потребностей</li><li>Лучше понять и услышать себя.</li></ul><strong>Ведущая:</strong> Инна (зал Игротеки)<br>Регистрация открыта.',
        },
        {
            time: '17:30 - 19:00',
            title: 'Кинезиотерапия - укрепление мышечного корсета',
            participantsCount: 6,
            description: 'Показана при наличии протрузий, межпозвоночных грыж, кифозов и лордозов.<br><strong>Ведущая:</strong> Наталья Демченко<br>Регистрация открыта.',
        },
        {
            time: '19:00 - 20:30',
            title: 'Практика для тазобедренных суставов + "Сурья Намаскар"',
            participantsCount: 10,
            description: '<strong>Ведущий:</strong> Владислав<br>Регистрация открыта.',
        },
        {
            time: '19:00 - 20:30',
            title: 'Разговорный клуб в онлайн формате',
            description: '<strong>Тема встречи:</strong> Сила вопроса.<br>Что будет?<ol><li>Много общения, игры, упражнения, обмен мнениями</li><li>Очень интересный гость!</li></ol><a href="https://t.me/+ZRFkhEYPOl84MDAy">Подробная информация и ссылка на встречу</a>.<br><strong>Модератор:</strong> Елена Троценко',
        }
    ]
};

const scheduleWednesday: ScheduleFmt = {
    date: '5 февраля',
    events: [
        {
            time: '08:30 - 10:00',
            title: 'Здоровая спина',
            participantsCount: 10,
            description: '<strong>Ведущий:</strong> Владислав<br>Регистрация открыта.',
        },
        {
            time: '12:30 - 14:00',
            title: 'Кинезиотерапия - укрепление мышечного корсета',
            participantsCount: 6,
            description: 'Показана при наличии протрузий, межпозвоночных грыж, кифозов и лордозов.<br><strong>Ведущая:</strong> Наталья Демченко<br>Регистрация открыта.',
        },
        {
            time: '15:30 - 17:00',
            title: 'Гвоздестояние',
            participantsCount: 6,
            description: 'Стояние на доске помогает избавиться от внутренних блоков и зажимов, раскрыть сознание навстречу новым возможностям и повысить концентрацию внимания.<br><strong>Ведущая:</strong> Анна<br>Регистрация открыта.',
        },
        {
            time: '17:00 - 18:30',
            title: 'Хатха йога (для взрослых)',
            participantsCount: 10,
            description: '<strong>Ведущая:</strong> Наталья Порохня<br>Регистрация открыта.',
        },
        {
            time: '18:30 - 20:00',
            title: 'Тактильная медитация осознанности',
            participantsCount: 12,
            description: 'Это практика, которая включает в себя использование тактильных ощущений для углубления осознания настоящего момента. Она может помочь развить внимательность, снизить уровень стресса и улучшить общее самочувствие.<br><strong>Ведущая:</strong> Эльвира<br>Регистрация открыта.',
        },
        {
            time: '17:55 - 19:00',
            title: 'Скорочтение',
            participantsCount: 10,
            description: '<p>Изучение техники скорочтения помогает быстро осваивать новые знания.</p><p>Развивает фотографическую память.</p><p>Тренирует навык работы с массивом информации.</p><p>Улучшает межполушарное взаимодействие.</p><p>Поможет сократить время затраченное на чтение полностью усваивая прочитанную информацию.</p><strong>Дети от 12 лет и взрослые.</strong><br><strong>Ведущая:</strong> Ирина Шатько (зал Игротеки)<br>Регистрация открыта.',
        }
    ]
};

// const addId = a => a.map(v=> a.id = Math.random());

function addID(a: ScheduleFmt) {
    a.events.forEach(v => v.id = Math.random().toString());
}

addID(scheduleThursday)
addID(scheduleWednesday)
export const mockFmt = [scheduleThursday, scheduleWednesday]
export default mockFmt