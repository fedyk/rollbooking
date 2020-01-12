import * as Router from '@koa/router';
import * as passport from './lib/passport'

import { router as bookingRouter } from './controllers/booking';
import { router as authRouter } from './controllers/auth/router';
import { router as onboardingRouter } from './controllers/onboarding/router';
import { router as settingsRouter } from './controllers/settings/router';
import { router as webRouter } from './web/router';

import { DEPRECATED_salonAliasMiddleware } from './middleware/salon-alias-middleware';
import { State } from './core/types/app/state';
import { templateMiddleware } from './middleware/template-middleware';
import { salonAliasMiddleware } from './middleware/salon-middleware';
import { getAllSalon } from './controllers/get-all-salons';

import { getSalonProfile } from './controllers/get-salon-profile';
import { getWelcomePage } from './controllers/get-welcome-page';
import { getSalonGeneralSettings } from './controllers/get-salon-general-settings';

export const router = new Router<State, any>();

router.get('/', templateMiddleware, getWelcomePage)
  .use('/auth', passport.router.routes())
  .get("/salons", templateMiddleware, getAllSalon)
  .get("/s/:alias", templateMiddleware, salonAliasMiddleware, getSalonProfile)
  .get("/s/:alias/settings", templateMiddleware, salonAliasMiddleware, getSalonGeneralSettings)

  .use('/', authRouter.routes(), authRouter.allowedMethods())
  .use('/', webRouter.routes(), webRouter.allowedMethods())
  .use('/onboarding', passport.onlyAuthenticated, onboardingRouter.routes(), onboardingRouter.allowedMethods())
  .use('/settings', passport.onlyAuthenticated, settingsRouter.routes(), settingsRouter.allowedMethods())
  .use("/:alias/booking", DEPRECATED_salonAliasMiddleware, bookingRouter.routes(), bookingRouter.allowedMethods())
