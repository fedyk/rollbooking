import * as Router from 'koa-router';
import * as passport from './lib/passport'


import { getWelcomePage } from './controllers/welcome/get-welcome-page';
import { router as bookingRouter } from './controllers/booking';
import { router as authRouter } from './controllers/auth/router';
import { router as onboardingRouter } from './controllers/onboarding/router';
import { router as settingsRouter } from './controllers/settings/router';
import { router as salonsRouter } from './controllers/salons/router';
import { router as calendarRouter } from './controllers/calendar/router';

import { salonAliasMiddleware } from './middlewares/salon-alias-middleware';
import { State } from './types/app/state';
import { templateMiddleware } from './middlewares/template-middleware';

export const router = new Router<State, any>();

router.get('/', templateMiddleware, getWelcomePage)
  .use('/', authRouter.routes(), authRouter.allowedMethods())
  .use('/onboarding', passport.onlyAuthenticated, onboardingRouter.routes(), onboardingRouter.allowedMethods())
  .use('/settings', passport.onlyAuthenticated, settingsRouter.routes(), settingsRouter.allowedMethods())
  .use('/salons', salonsRouter.routes(), salonsRouter.allowedMethods())
  .use('/auth', passport.router.routes());

router.use("/:alias/booking", salonAliasMiddleware, bookingRouter.routes(), bookingRouter.allowedMethods());
router.use("/:alias/calendar", salonAliasMiddleware, calendarRouter.routes(), calendarRouter.allowedMethods());
