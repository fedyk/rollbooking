import * as Router from '@koa/router'
import { State, Context } from './types/app';
import * as auth from './auth'
import * as middleware from './middleware/template'
import * as welcome from './welcome-page/get-welcome-page'
import * as dashboard from './dashboard'

export const router = new Router<State, Context>();

router.get('/', middleware.template, welcome.getWelcomePage)
router.get('/join', middleware.template, auth.join)
router.get('/dashboard', middleware.template, dashboard.getDashboard)
