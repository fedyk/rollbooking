import * as Router from '@koa/router'
import { State } from './types/app/state'
import * as middleware from './middleware/template'
import * as welcome from './welcome-page/get-welcome-page'

export const router = new Router<State, any>();

router.get('/', middleware.template, welcome.getWelcomePage)
