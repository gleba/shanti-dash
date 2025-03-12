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
console.log("::::::::::::::::::::::::::::")
console.log("RT_KEY", process.env.RT_KEY)
console.log("::::::::::::::::::::::::::::")
// gpt-4.5 22.5000
// gpt-4o 1.3500
// gpt-4o-mini 0.1200
// o3-mini 1.5000
// o1-preview 6.0000
// o1-mini 1.5000
// o1 6.0000
// deepseek-r1 3.2000
// deepseek-3 0.1400
// grok-2 4.2000
// nemotron-70b 0.1600
// jamba-1-5-mini 0.1000
// jamba-1-5-large 0.8000
// qwen-2.5-72b-instruct 0.1100
// qwen-2.5-coder-32b-instruct 0.0600
// mistral-large 1.0000
// mistral-small 0.2000
// ministral-8b 0.1000
// ministral-3b 0.0400
// pixtral-12b 0.1200
// pixtral-large 0.8000
// codestral-mamba 0.1500
// mixtral-8x22b 1.2000
// mixtral-8x7b 0.6000
// command-r-plus 1.5000
// command-r 0.0900
// faceswap 0.0000
// yi-large 2.7500
// llama-3.1-405b 2.8500
// grok-2-mini 4.2000
// llama-v3p2-90b 0.9000
// llama-v3p3-70b 0.9000
// llama-v3p2-11b 0.2000
// llama-v3p2-3b 0.1500
// llama-3-70b 0.6500
// llama-3-8b 0.0500
// midjourney 0.0000
// bgremover 0.0000
// text-embedding-ada-002 0.0500
// text-embedding-3-small 0.0200
// text-embedding-3-large 0.0700
// text-moderation-latest 0.0100
// omni-moderation-latest 0.0100
// text-moderation-007 0.0100
// gpt-4 2.7000
// gpt-4-turbo 2.7000
// gpt-3.5-turbo 0.5000
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