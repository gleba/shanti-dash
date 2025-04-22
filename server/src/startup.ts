import "./http.start.ts"
import {restore} from "./telegram.messageHandler.ts";
import {setupFrontState} from "./state.front.ts";

setupFrontState()
restore()
// import './draft'
import { isProd } from './constatnts.ts'
import { DB } from './db.ts'
import { historySync } from './history.sync.ts'
// import { historySync } from './history.sync.ts'

//historySync()