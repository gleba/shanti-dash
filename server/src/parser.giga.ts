import fs from "node:fs";
import GigaChat from 'gigachat';
import {Agent} from 'node:https';
import path from "node:path";
import {notifyError} from "./telegram.ts";
import {ChatCompletion} from "gigachat/interfaces";

const httpsAgent = new Agent({
    rejectUnauthorized: false, // Отключает проверку корневого сертификата
    // Читайте ниже как можно включить проверку сертификата Мин. Цифры
});

const client = new GigaChat({
    timeout: 600,
    model: 'GigaChat-Max',
    credentials: process.env.GIGACHAT_CREDENTIALS,
    httpsAgent: httpsAgent,
});

const stateDefinition = fs.readFileSync(path.resolve(__dirname, 'state.d.ts')).toString();


if (process.env.NODE_ENV != 'production') {
    const storeSrcPath = path.resolve("..", 'src', 'store', 'state.d.ts')
    console.log("storeSrcPath", storeSrcPath);
    const write = () => fs.writeFileSync(storeSrcPath, stateDefinition)
    if (fs.existsSync(storeSrcPath)) {
        const storeSrc = fs.readFileSync(storeSrcPath).toString();
        if (storeSrc != stateDefinition) {
            write()
        }
    } else {
        write()
    }
}


const prompts = {
    big: {
        role: "system",
        content: `Ты алгоритм выделения сущностей из текста.
    Выделяй только релевантную информацию из текста
    Если ты не знаешь значение для атрибута, который нужно выделить проставь значение этого атрибута в null.     
    Генерируй в формате JSON для интерфйса
    ${stateDefinition}
    `
    },
    // update: {
    //     role: "system",
    //     content: `Ты алгоритм выделения сущностей из текста.
    // Выделяй только релевантную информацию из текста
    // Если ты не знаешь значение для атрибута, который нужно выделить проставь значение этого атрибута в null.
    // Генерируй в формате JSON для интерфйса
    // ${stateDefinition}
    // `
    // }
}

export type PromptPreset = keyof typeof prompts

export async function parserGiga(htmlText: string, mode: PromptPreset): Promise<ChatCompletion> {
    return new Promise((resolve, reject) => {
        try {
            client
                .chat({
                    messages: [prompts[mode], {role: 'user', content: htmlText}],
                })
                .then((resp) => {
                    // fs.writeFileSync(`resp-${Date.now() / 10000}.json`, JSON.stringify(resp, null, 2));
                    resolve(resp);
                }).catch(reject);

        } catch (error) {
            notifyError("Гигапарс неудался", error)
            reject(error);
        }
    })

}