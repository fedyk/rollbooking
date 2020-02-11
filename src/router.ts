import * as Router from '@koa/router'
import { State, Context } from './types/app';
import * as auth from './auth'
import * as middleware from './middleware'
import * as welcome from './welcome-page/get-welcome-page'
import * as dashboard from './dashboard'
import controllers from './controllers'
import * as explore from './explore'

export const router = new Router<State, Context>();

router.use(middleware.session)

/** General */
router.get('/', middleware.template, middleware.layout, welcome.getWelcomePage)
router.post('/join', auth.join)
router.get("/explore", middleware.template, middleware.layout, explore.getExplore)

/** Dashboard */
router.get('/dashboard', middleware.template, middleware.layout, dashboard.getDashboard)

/** Business */
router.get("/b/:id", middleware.template, middleware.layout, controllers.business.layout, controllers.business.getSlots)
router.get("/b/:id/create/event", middleware.template, middleware.layout, controllers.business.layout, controllers.business.createEvent)
router.post("/b/:id/create/event", middleware.template, middleware.layout, controllers.business.layout, controllers.business.createEvent)
router.get("/b/:id/events/:eventId", middleware.template, middleware.layout, controllers.business.layout, controllers.business.getEvent)
router.get("/b/:id/masters", middleware.template, middleware.layout, controllers.business.layout, controllers.business.getMasters)
router.get("/b/:id/settings", middleware.template, middleware.layout, controllers.business.layout, controllers.business.getSettings)
