import * as Router from 'koa-router';
import * as passport from './lib/passport'


import { welcome } from './controllers/welcome';
import { router as bookingRouter } from './controllers/booking';
import { router as authRouter } from './controllers/auth/router';
import { router as onboardingRouter } from './controllers/onboarding/router';
import { router as settingsRouter } from './controllers/settings/router';
import { router as salonsRouter } from './controllers/salons/router';
import { router as calendarRouter } from './controllers/calendar/router';

import { salonAliasMiddleware } from './middlewares/salon-alias-middleware';

export const router = new Router<any, any>();

router.get('/', welcome)
  .use('/', authRouter.routes(), authRouter.allowedMethods())
  .use('/onboarding', passport.onlyAuthenticated, onboardingRouter.routes(), onboardingRouter.allowedMethods())
  .use('/settings', passport.onlyAuthenticated, settingsRouter.routes(), settingsRouter.allowedMethods())
  .use('/salons', salonsRouter.routes(), salonsRouter.allowedMethods())
  .use('/auth', passport.router.routes());

router.use("/:alias/booking", salonAliasMiddleware, bookingRouter.routes(), bookingRouter.allowedMethods());
router.use("/:alias/calendar", salonAliasMiddleware, calendarRouter.routes(), calendarRouter.allowedMethods());
