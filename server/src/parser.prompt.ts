import fs from "node:fs";
import path from "node:path";
import {ChatCompletion} from "gigachat/interfaces";

const stateDefinition = fs.readFileSync(path.resolve(__dirname, '../../shared/state.d.ts')).toString();


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
    В поле описания используй списки по возможности там где уместно
    Генерируй в формате JSON для интерфйса, внимательно отнесисись к комментариям полей структуры.
    Если ты не знаешь значение для атрибута, который нужно выделить проставь значение этого атрибута в null.     
    ${stateDefinition}
    `
    },
}