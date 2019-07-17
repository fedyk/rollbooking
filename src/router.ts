import * as Router from 'koa-router';
import * as passport from './lib/passport'

import { getWelcomePage } from './controllers/get-welcome-page';
import { router as bookingRouter } from './controllers/booking';
import { router as authRouter } from './controllers/auth/router';
import { router as onboardingRouter } from './controllers/onboarding/router';
import { router as settingsRouter } from './controllers/settings/router';
import { router as calendarRouter } from './controllers/calendar/router';

import { DEPRECATED_salonAliasMiddleware } from './middleware/salon-alias-middleware';
import { State } from './types/app/state';
import { templateMiddleware } from './middleware/template-middleware';
import { salonAliasMiddleware } from './middleware/salon-middleware';
import { getSalonProfile } from './controllers/get-salon-profile';
import { getAllSalon } from './controllers/get-all-salons';

export const router = new Router<State, any>();

router.get('/', templateMiddleware, getWelcomePage)
  .use('/', authRouter.routes(), authRouter.allowedMethods())
  .use('/onboarding', passport.onlyAuthenticated, onboardingRouter.routes(), onboardingRouter.allowedMethods())
  .use('/settings', passport.onlyAuthenticated, settingsRouter.routes(), settingsRouter.allowedMethods())
  .use('/auth', passport.router.routes())
  .get("/salons", templateMiddleware, getAllSalon)
  .get("/s/:alias", templateMiddleware, salonAliasMiddleware, getSalonProfile)
  .use("/:alias/booking", DEPRECATED_salonAliasMiddleware, bookingRouter.routes(), bookingRouter.allowedMethods())
  .use("/:alias/calendar", DEPRECATED_salonAliasMiddleware, calendarRouter.routes(), calendarRouter.allowedMethods());
