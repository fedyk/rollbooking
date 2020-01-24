import * as Router from '@koa/router'
import { State, Context } from './types/app';
import * as auth from './auth'
import * as middleware from './middleware/template'
import * as welcome from './welcome-page/get-welcome-page'
import * as dashboard from './dashboard'
import * as accountProfile from './account-profile'
import * as explore from './explore'

export const router = new Router<State, Context>();

/**
 * General
 */
router.get('/', middleware.template, welcome.getWelcomePage)
router.post('/join', auth.join)
router.get("/explore", middleware.template, explore.getExplore)

/**
 * Dashboard
 */
router.get('/dashboard', middleware.template, dashboard.getDashboard)

/**
 * Profiles
 */
router.get('/p/:id', middleware.template, accountProfile.getAccountProfile)
