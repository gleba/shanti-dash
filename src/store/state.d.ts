interface OneDayEvents {
    date: string;         // дата события, день недели, число и месяц
    isValid: boolean;      // исходные данные адекватны структуре
    events: SingleEvent[];      // Список событий
}
interface SingleEvent {
    time: string;         //Время события в формате HH:mm - HH:mm
    icon: string;         // Эмоджи события, один символ
    title: string;         // Заголовок мероприятия, отформатируй если присутствуют ошибки или асиметрия, убери смайлы в поле icon
    instructor: string;    // Ведущий или инструктор
    description: string;   // Полное описание мероприятия с сохранением смысла и точности текста. Исключи из текста сущности других полей. Формат HTML. ,
    participantsCount?: number;  // Возможное количество участников
    isForKids?: boolean;   // Для детей
    isNotForKids?: boolean;  // Для взрослых
}