import * as Koa from "koa";
import { join } from "path";
import * as serve from "koa-static";
import * as session from "koa-session";
import { config } from "./lib/config";
import { addFilter, middleware } from "./lib/render"
import { config as sessionConfig } from "./lib/session"
import * as passport from "./lib/passport"
import * as bodyParser from "koa-bodyparser"
import { renderFilters } from "./lib/render-filters"
import { router } from "./router";

const app = new Koa();

app.keys = config.APP_KEYLIST.split(";");

// nunjucks filters
renderFilters.forEach(([filterName, filter]) => {
  addFilter(filterName, filter)
});

// middleware
app.use(bodyParser())
app.use(middleware())
app.use(session(sessionConfig, app))
app.use(serve(join(__dirname, "../public")))
app.use(serve(join(__dirname, "../dist/packages")))
app.use(passport.initialize())
app.use(passport.session())
app.use(router.routes());

if (!module.parent) {
  app.listen(config.PORT, function() {
    console.log(`app is listening PORT ${config.PORT}`)
  });
}
