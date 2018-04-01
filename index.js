const Koa = require('koa');
const log = require('debug')('app')
const app = new Koa();

// x-response-time

app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
});

// logger

app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  log(`${ctx.method} ${ctx.url} - ${ms}`);
});


app.use(async ctx => {
  ctx.body = 'Hello World 3';
});

app.listen(process.env.PORT || 3000);
