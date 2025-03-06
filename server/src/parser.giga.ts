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
    model: 'GigaChat',
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


export const gigaPromts = {
    big: {
        role: "system",
        content: `Ты алгоритм выделения сущностей из текста.
    Выделяй только релевантную информацию из текста             
    !!!В полях title не должно быть ковычек и не более 2-3 слов!!!
    Генерируй в формате JSON для интерфйса, внимательно отнесисись к комментариям полей структуры.
    Если ты не знаешь значение для атрибута, который нужно выделить проставь значение этого атрибута в null. 
    ${stateDefinition}
    `
    },
}

export type PromptPreset = keyof typeof gigaPromts

export async function parserGiga(htmlText: string, mode: PromptPreset): Promise<ChatCompletion> {
    return new Promise((resolve, reject) => {
        client
            .chat({
                messages: [gigaPromts[mode], {role: 'user', content: htmlText}],
            })
            .then(v=>{
                console.log(v)
                resolve(v)
            })
            .catch(reject);
    })

}