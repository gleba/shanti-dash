
export type ITimeAction = {
    isCancel?: boolean
    time?: string
    pos?: number
}

const regexNumber = /\d+/g;

export function timeAction(text: string): ITimeAction {
    const numbers = text.match(regexNumber);
    const isCancel = text.toLowerCase().search("отмена") != -1;
    if (numbers === null) {
        return {
            isCancel,
        }
    }
    let h = numbers[0]
    if (h.length != 2) {
        h = "0" + h
    }
    const pos = numbers.length === 3 ? parseInt(numbers[2]) : undefined
    return {
        time: h + ":" + numbers[1],
        isCancel,
        pos
    }
}