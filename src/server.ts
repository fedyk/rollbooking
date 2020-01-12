import * as Koa from "koa";
import { join } from "path";
import * as serve from "koa-static";
import * as session from "koa-session";
import * as passport from "koa-passport";
import { config } from "./lib/config";
import { addFilter_DEPRECATED, middleware_DEPRECATED } from "./lib/render"
import { config as sessionConfig } from "./lib/session"
import * as bodyParser from "koa-bodyparser"
import { renderFilters_DEPRECATED } from "./lib/render-filters"
import { router } from "./router";

const app = new Koa();

app.keys = config.APP_KEYLIST.split(";")

// // nunjucks filters
renderFilters_DEPRECATED.forEach(([filterName, filter]) => {
  addFilter_DEPRECATED(filterName, filter)
})

// middleware
app.use(bodyParser())
app.use(middleware_DEPRECATED())
app.use(session(sessionConfig, app))
app.use(serve(join(__dirname, "../public")))
app.use(passport.initialize())
app.use(passport.session())
app.use(router.routes());

if (!module.parent) {
  app.listen(config.PORT, function() {
    console.log(`app is listening PORT ${config.PORT}`)
  });
}
