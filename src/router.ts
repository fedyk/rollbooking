import * as Router from '@koa/router'
import { State, Context } from './types/app';
import * as middleware from './middleware/template'
import * as welcome from './welcome-page/get-welcome-page'

export const router = new Router<State, Context>();

router.get('/', middleware.template, welcome.getWelcomePage)
