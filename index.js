const Koa = require('koa');
const debug = require('debug')('app');
const render = require('./src/lib/render');
const oauth = require('./src/lib/oauth2');
const serve = require('koa-static');
const koaBody = require('koa-body');
const router = require('./src/router');

const app = new Koa();

app.context.googleOAuth2Client = oauth.googleOAuth2Client();

app.use(render)
// app.use(koaBody);
app.use(router.routes())
app.use(router.allowedMethods())
app.use(serve(__dirname + '/assets'))

// x-response-time

app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  
  ctx.set('X-Response-Time', `${ms}ms`);

  debug(`response-time: ${ms}ms`);
});

// logger

app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  debug(`${ctx.method} ${ctx.url} - ${ms}`);
});


app.listen(process.env.PORT || 5000);

debug('listen port %s', process.env.PORT || 5000);
