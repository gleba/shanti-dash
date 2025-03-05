import {Bot} from 'delete'
import {telegramMessageHandler} from "./telegram.messageHandler.ts"
import {parseMode} from "@grammyjs/parse-mode"
import {Message} from "@grammyjs/types";
import {API_CONSTANTS, Bot} from "grammy";
import {ActionMessage} from "./b";
import {historySync} from "./sync.ts";

const telegramBotToken = process.env["TELEGRAM_BOT_TOKEN"] as string

if (!telegramBotToken) {
    console.error("No telegram bot token found")
} else {
    console.info("telegramBotToken fine")
}
export const bot = new Bot(telegramBotToken) // <-- place your token inside this string

bot.api.config.use(parseMode("HTML"));
bot.on('message', async (ctx, next) => {
    const m = ctx.message
    m && telegramMessageHandler(m, "new")
    await next()
})

bot.on('edited_message', async (ctx, next) => {
    const m = ctx.update.edited_message
    m && telegramMessageHandler(m, "is_edit")
    await next()
})


bot.catch(err => console.error(err))

bot.api.getMe().then(ctx => {
    console.log("botName:", ctx.username)
})

bot.command("start", async (ctx) => {
    await ctx.reply("Открыть расписание", {
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: "Расписание",
                        web_app: {url: "https://x.caaat.ru"}, // Укажите ваш сайт
                    },
                ],
            ],
        },
    });
});
bot.start({
    allowed_updates: API_CONSTANTS.ALL_UPDATE_TYPES
})


export function doublePos(m1: ActionMessage, m2: ActionMessage) {
    // console.log("doublePos")
    // TODO: notify admin of error
}

export function notifyError(text: string, error: any) {
    // TODO: notify admin of error
}

export function markMessage(m: Message, emo: any) {
    // TODO: this is a hacky way to mark a message as read
}