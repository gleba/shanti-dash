interface OneDayEvents {
    date: string;         // дата события, день недели, число и месяц
    isValid: boolean;      // исходные данные адекватны структуре
    events: SingleEvent[];      // Список событий
}

interface SingleEvent {
    time: string;         //Время события
    icon: string;         // Эмоджи события, один символ, придумай если нету
    title: string;         // Краткий заголовок мероприятия, если есть выражение в ковычках - используй только его. Оформатируй если присутствуют ошибки или асиметрия, игнорируй смайлы и ковычки.
    instructor: string;    // Ведущий или инструктор
    description: string;   // Полное описание мероприятия сохранением ссылок и смысла. Отформатируй в HTML. исключи слова "регистрация открыта" для этого поля
    descriptionExplain: string;   // Объясни что это за мероприятие.
    participantsCount?: number;  // Возможное количество участников
    isGameRoom?: boolean;         // В зале игротеки?
    isOnline?: boolean;         // Это онлайн мероприятие, если указано в описании
    eventUrl: string;            // ссылка мероприятия
    isOnlyForWoman?: boolean;         // Только для девушек и женщин?
    isForKids?: boolean;   // Для детей
    isNotForKids?: boolean;  // Для взрослых
}