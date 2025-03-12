import {ChatCompletion} from "gigachat/interfaces";
import {gigaPromts, PromptPreset} from "./parser.prompt.ts";
import fs from "node:fs";

const headers = {
    'Authorization': process.env.RT_KEY,
}
// fetch('https://gptunnel.ru/v1/models', {
//     headers
// }).then(response => response.json())
//     .then(d => d?.data.forEach(i => console.log(i.id, i.cost_context)))

const rq = (body) => fetch('https://gptunnel.ru/v1/chat/completions', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': process.env.RT_KEY,
    },
    body: JSON.stringify(body),
})
console.log("RT_KEY", process.env.RT_KEY?.length)
export async function parserRT(htmlText: string): Promise<ChatCompletion> {
    return new Promise((resolve, reject) => {
        const startTime = Date.now()
        const model = "gpt-4o-mini"

        console.log("start GPT RQ", model)
        rq({
            model,
            // max_tokens: 1000,
            messages: [
                gigaPromts.big,
                {role: 'user', content: htmlText},
            ],
        })
            .then(response => {
                const ms = Date.now() - startTime
                // console.log('bench-' + model + '__' + ms + ".json")
                console.log("GPT RESPONSE", response.ok)
                if (response.ok) {
                    response.text()
                        .then(text => {
                            console.log("GPT TEXT OK");
                            // fs.writeFileSync('bench-' + model + '__' + ms + ".json", text)
                            resolve(JSON.parse(text))
                        })
                    return
                } else {
                    return response.text()
                }
            })
    })
}