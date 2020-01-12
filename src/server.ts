import * as Koa from "koa";
import { join } from "path";
import * as serve from "koa-static";
import * as session from "koa-session";
import * as passport from "koa-passport";
import { config_DEPRECATED } from "./lib/config";
import { config as sessionConfig } from "./lib/session"
import * as bodyParser from "koa-bodyparser"
import { router } from "./router";

export async function createServer() {
  const app = new Koa();

  app.keys = config_DEPRECATED.APP_KEYLIST.split(";")

  // middleware
  app.use(bodyParser())
  app.use(session(sessionConfig, app))
  app.use(serve(join(__dirname, "../public")))
  app.use(passport.initialize())
  app.use(passport.session())
  app.use(router.routes());

  app.listen(config_DEPRECATED.PORT, function () {
    console.log(`app is listening PORT ${config_DEPRECATED.PORT}`)
  })
}

if (!module.parent) {
  createServer().catch(err => console.error(err))
}
