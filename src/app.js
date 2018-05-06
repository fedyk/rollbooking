const path = require('path');
const serve = require('koa-static');
const koaBody = require('koa-body');
const logger = require('koa-logger');
const router = require('koa-router')();
const config = require('./lib/config');
const render = require('./lib/render');
const session = require('./lib/session');
const passport = require('./lib/passport');
const bodyParser = require('koa-bodyparser');

const Koa = require('koa');
const app = module.exports = new Koa();

const welcome = require('./controllers/welcome');
const auth = require('./controllers/auth');

app.keys = (process.env.APP_KEYLIST || '').split(';');

// "database"

const posts = [];

// middleware

app.use(bodyParser());
app.use(logger());
app.use(render);
app.use(koaBody());
app.use(session(app));
app.use(serve(path.join(__dirname, '../public')));
app.use(passport.initialize());
app.use(passport.session());

// route definitions

router.get('/', welcome)
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
