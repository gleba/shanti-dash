import "./http.start.ts"
import {restore} from "./telegram.messageHandler.ts";
import {setupFrontState} from "./state.front.ts";

setupFrontState()
restore()


