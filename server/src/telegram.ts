import {Bot} from 'grammy'
import {telegramMessageHandler} from "./telegram.messageHandler.ts"
import {parseMode} from "@grammyjs/parse-mode"
import {Message} from "@grammyjs/types";

const telegramBotToken = process.env["TELEGRAM_BOT_TOKEN"] as string

if (!telegramBotToken) {
    console.error("No telegram bot token found")
} else {
    console.info("telegramBotToken fine")
}
export const bot = new Bot(telegramBotToken) // <-- place your token inside this string

bot.api.config.use(parseMode("HTML"));
bot.on('message', async (ctx, next) => {
    telegramMessageHandler(ctx)
    await next()
})
bot.on('edited_message', async (ctx, next) => {
    await next()
})


bot.catch(err => console.error(err))

bot.api.getMe().then(ctx => {
    console.log("botName:", ctx.username)
})

bot.start()


export function notifyError(text: string, error: any) {
    // TODO: notify admin of error
}

export function markMessage(m:Message, emo:any) {
    // TODO: this is a hacky way to mark a message as read
}