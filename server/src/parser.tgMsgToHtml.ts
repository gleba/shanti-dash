import {Message} from "@grammyjs/types";


export default function parseTgMsgToHtml(message: Message): string {

    let formattedText = message.text || ""; // Начинаем с обычного текста


    // Проверяем наличие entities для форматирования
    if (message?.entities) {
        // Сортируем entities по позиции
        message.entities.sort((a, b) => a.offset - b.offset);

        // Создаем массив для хранения частей текста
        const parts = [];
        let lastIndex = 0;

        for (const entity of message.entities) {
            // Добавляем текст до текущей entity
            parts.push(formattedText.slice(lastIndex, entity.offset));

            // Определяем тип форматирования
            switch (entity.type) {
                case 'bold':
                    parts.push(`<b>${formattedText.slice(entity.offset, entity.offset + entity.length)}</b>`);
                    break;
                case 'italic':
                    parts.push(`<i>${formattedText.slice(entity.offset, entity.offset + entity.length)}</i>`);
                    break;
                case 'underline':
                    parts.push(`<u>${formattedText.slice(entity.offset, entity.offset + entity.length)}</u>`);
                    break;
                case 'strikethrough':
                    parts.push(`<s>${formattedText.slice(entity.offset, entity.offset + entity.length)}</s>`);
                    break;
                case 'text_link':
                    const url = entity.url; // Получаем URL для ссылки
                    parts.push(`<a href="${url}">${formattedText.slice(entity.offset, entity.offset + entity.length)}</a>`);
                    break;
                default:
                    parts.push(formattedText.slice(entity.offset, entity.offset + entity.length));
            }

            lastIndex = entity.offset + entity.length; // Обновляем последний индекс
        }

        // Добавляем оставшуюся часть текста после последней entity
        parts.push(formattedText.slice(lastIndex));

        formattedText = parts.join('');
    }

    return formattedText
}
