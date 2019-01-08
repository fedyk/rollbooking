import * as Router from 'koa-router';
import * as passport from './lib/passport'


import { welcome } from './controllers/welcome';
import * as salonServices from './controllers/salon-services';

import { router as bookingRouter } from './controllers/booking/router';
import { router as authRouter } from './controllers/auth/router';
import { router as onboardingRouter } from './controllers/onboarding/router';
import { router as settingsRouter } from './controllers/settings/router';
import { router as salonSettingsRouter } from './controllers/salon-settings/router';
import { router as salonsRouter } from './controllers/salons/router';
import { router as calendarRouter } from './controllers/calendar/router';

export const router = new Router();

router.get('/', welcome)

  .get('/schedule/:salonId/services', passport.onlyAuthenticated, salonServices.getSalonServices)
  .post('/schedule/:salonId/services', passport.onlyAuthenticated, salonServices.addSalonService)
  .get('/schedule/:salonId/service/:serviceId', passport.onlyAuthenticated, salonServices.getSalonService)
  .put('/schedule/:salonId/service/:serviceId', passport.onlyAuthenticated, salonServices.updateSalonService)
  .del('/schedule/:salonId/service/:serviceId', passport.onlyAuthenticated, salonServices.removeSalonService)

  .use('/', authRouter.routes(), authRouter.allowedMethods())
  .use('/booking', bookingRouter.routes(), bookingRouter.allowedMethods())
  .use('/onboarding', passport.onlyAuthenticated, onboardingRouter.routes(), onboardingRouter.allowedMethods())
  .use('/settings', passport.onlyAuthenticated, settingsRouter.routes(), settingsRouter.allowedMethods())
  .use('/salon:salonId/settings', passport.onlyAuthenticated, salonSettingsRouter.routes(), salonSettingsRouter.allowedMethods())
  .use('/salons', salonsRouter.routes(), salonsRouter.allowedMethods())
  .use('/calendar', calendarRouter.routes(), calendarRouter.allowedMethods())
  .use('/auth', passport.router.routes());
