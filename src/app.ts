import './lib/config'

import * as Koa from 'koa';
import * as Router from 'koa-router';
import { join } from 'path';
import * as serve from 'koa-static';
import { addFilter, middleware } from './lib/render'
import { session } from './lib/session'
import * as passport from './lib/passport'
import * as bodyParser from 'koa-bodyparser'
import { renderFilters } from './lib/render-filters'

import { welcome } from './controllers/welcome';
import * as schedule from './controllers/schedule';
import * as salonServices from './controllers/salon-services';
import * as widgets from './controllers/widgets';

import { router as authRouter } from './controllers/auth/router';
import { router as widgetRouter } from './controllers/widgets/router';
import { router as scheduleRouter } from './controllers/schedule/router';
import { router as onboardingRouter } from './controllers/onboarding/router';
import { router as settingsRouter } from './controllers/settings/router';
import { router as salonSettingsRouter } from './controllers/salon-settings/router';

const app = module.exports = new Koa();
const router = new Router()

app.keys = (process.env.APP_KEYLIST || '').split(';');

// nunjucks filters
renderFilters.forEach(([filterName, filter]) => {
  addFilter(filterName, filter)
})

// middleware

app.use(bodyParser())
app.use(middleware())
app.use(session(app))
app.use(serve(join(__dirname, '../public')))
app.use(passport.initialize())
app.use(passport.session())

// route definitions

router.get('/', welcome)
  // .get('/schedule/:salonId', passport.onlyAuthenticated, schedule)
  .get('/schedule/:salonId/user-details/:userId', passport.onlyAuthenticated, schedule.getUserDetails)
  .post('/schedule/:salonId/user-details/:userId', passport.onlyAuthenticated, schedule.updateUserDetails)
  .post('/schedule/:salonId/remove-user/:userId', passport.onlyAuthenticated, schedule.removeUser)

  .get('/schedule/:salonId/services', passport.onlyAuthenticated, salonServices.getSalonServices)
  .post('/schedule/:salonId/services', passport.onlyAuthenticated, salonServices.addSalonService)
  .get('/schedule/:salonId/service/:serviceId', passport.onlyAuthenticated, salonServices.getSalonService)
  .put('/schedule/:salonId/service/:serviceId', passport.onlyAuthenticated, salonServices.updateSalonService)
  .del('/schedule/:salonId/service/:serviceId', passport.onlyAuthenticated, salonServices.removeSalonService)

  .get('/widgets/reservation/:salonId', widgets.reservation)
  .get('/widgets/reservation/:salonId/confirm', widgets.reservationConfirm)
  .get('/widgets/reservation/:salonId/preview', widgets.reservationPreview)

  .use('/', authRouter.routes(), authRouter.allowedMethods())
  .use('/widgets/', widgetRouter.routes(), widgetRouter.allowedMethods())
  .use('/onboarding', passport.onlyAuthenticated, onboardingRouter.routes(), onboardingRouter.allowedMethods())
  .use('/schedule/', passport.onlyAuthenticated, scheduleRouter.routes(), scheduleRouter.allowedMethods())
  .use('/settings', passport.onlyAuthenticated, settingsRouter.routes(), settingsRouter.allowedMethods())
  .use('/salon:salonId/settings', passport.onlyAuthenticated, salonSettingsRouter.routes(), salonSettingsRouter.allowedMethods())
  .use('/auth', passport.router.routes());

app.use(router.routes());

if (!module.parent) {
  app.listen(process.env.PORT || 3000);
}
