import {Message} from "@grammyjs/types";
import {ChatCompletion} from "gigachat/interfaces";

export interface FullDaySheet {
    id: number;
    timestamp: number;
    message: Message;
    data: ChatCompletion
}