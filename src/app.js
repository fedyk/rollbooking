const path = require('path');
const serve = require('koa-static');
const router = require('koa-router')();
const config = require('./lib/config');
const { addFilter, middleware } = require('./lib/render');
const { session } = require('./lib/session');
const passport = require('./lib/passport');
const bodyParser = require('koa-bodyparser');
const { renderFilters } = require('./lib/render-filters');
// const helmet = require("koa-helmet"); // todo

const Koa = require('koa');
const app = module.exports = new Koa();

const { router: authRouter } = require('./controllers/auth/router');
const welcome = require('./controllers/welcome');
const schedule = require('./controllers/schedule');
const salonServices = require('./controllers/salon-services');
const widgets = require('./controllers/widgets');
const onboarding = require('./controllers/onboarding');

const { router: widgetRouter } = require('./controllers/widgets/router');
const { router: scheduleRouter } = require('./controllers/schedule/router');

app.keys = (process.env.APP_KEYLIST || '').split(';');

// nunjucks filters
renderFilters.forEach(([filterName, filter]) => {
  addFilter(filterName, filter)
})

// middleware

app.use(bodyParser())
app.use(middleware())
app.use(session(app))
app.use(serve(path.join(__dirname, '../public')))
app.use(passport.initialize())
app.use(passport.session())

// route definitions

router.get('/', welcome)
  // .get('/schedule/:salonId', passport.onlyAuthenticated, schedule)
  .post('/schedule/:salonId/invite-user', passport.onlyAuthenticated, schedule.inviteUser)
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
  .use('/schedule/', passport.onlyAuthenticated, scheduleRouter.routes(), scheduleRouter.allowedMethods())

  .get('/onboarding', passport.onlyAuthenticated, onboarding)
  .post('/onboarding', passport.onlyAuthenticated, onboarding.createSalon)
  // .get('/login', auth.login)
  // .get('/logout', auth.logout)
  .use('/auth', passport.router.routes());

app.use(router.routes());

// listen

if (!module.parent) {
  app.listen(process.env.PORT || 3000);
}
