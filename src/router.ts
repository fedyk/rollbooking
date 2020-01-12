import * as Router from '@koa/router'
import { State } from './core/types/app/state'
import * as middleware from './middleware/template'
import * as welcome from './welcome/get-welcome-page'

export const router = new Router<State, any>();

router.get('/', middleware.template, welcome.getWelcomePage)
