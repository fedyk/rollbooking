const path = require('path');
const serve = require('koa-static');
const router = require('koa-router')();
const config = require('./lib/config');
const render = require('./lib/render');
const session = require('./lib/session');
const passport = require('./lib/passport');
const bodyParser = require('koa-bodyparser');
const { renderFilters } = require('./lib/render-filters');

const Koa = require('koa');
const app = module.exports = new Koa();

const auth = require('./controllers/auth');
const welcome = require('./controllers/welcome');
const schedule = require('./controllers/schedule');
const salonServices = require('./controllers/salon-services');
const widgets = require('./controllers/widgets');
const onboarding = require('./controllers/onboarding');

const widgetRouter = require('./controllers/widgets/router')
const scheduleRouter = require('./controllers/schedule/router')

app.keys = (process.env.APP_KEYLIST || '').split(';');

// nunjucks filters
renderFilters.forEach(([filterName, filter]) => {
  render.addFilter(filterName, filter)
})

// middleware

app.use(bodyParser())
app.use(render()) // todo: remove this middleware
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

  .use('/widgets/', widgetRouter.routes(), widgetRouter.allowedMethods())
  .use('/schedule/', passport.onlyAuthenticated, scheduleRouter.routes(), scheduleRouter.allowedMethods())

  .get('/onboarding', passport.onlyAuthenticated, onboarding)
  .post('/onboarding', passport.onlyAuthenticated, onboarding.createSalon)
  .get('/login', auth.login)
  .get('/logout', auth.logout)
  .use('/auth', passport.router.routes())
  .get('/list', list)
  .get('/post/new', add)
  .get('/post/:id', show)
  .post('/post', create);

app.use(router.routes());

/**
 * Post listing.
 */

async function list(ctx) {
  await ctx.render('list', { posts: posts });
}

/**
 * Show creation form.
 */

async function add(ctx) {
  await ctx.render('new');
}

/**
 * Show post :id.
 */

async function show(ctx) {
  const id = ctx.params.id;
  const post = posts[id];
  if (!post) ctx.throw(404, 'invalid post id');
  await ctx.render('show', { post: post });
}

/**
 * Create a post.
 */

async function create(ctx) {
  const post = ctx.request.body;
  const id = posts.push(post) - 1;
  post.created_at = new Date();
  post.id = id;
  ctx.redirect('/');
}

// listen

if (!module.parent) app.listen(3000);
