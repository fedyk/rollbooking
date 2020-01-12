import * as Router from "@koa/router";
import { App$Context, App$State } from "./types";
import { getLoginPage } from "./middlewares/get-login-page";
import { select } from '../lib/passport'
import { getLandingPage } from "./middlewares/get-landing-page";
import { getDashboardPage } from "./middlewares/get-dashboard-page";
import { template } from "../middleware/template";

export const router = new Router<App$Context, App$State>();

router.all("welcome", template, select<App$Context>({
  guest: getLandingPage,
  loggedIn: getDashboardPage
}))

router.all("login", m, getLoginPage)

// router.get("/about", c("article#about"))
// router.get("/privacy", c("article#privacy"))
// router.get("/:salon", c("salonProfile"))
// router.get("/:salon/settings", c("salonSettings"))
// router.get("/:salon/widget", c("salonWidget"))

function c(name: string) {
  return function noop(ctx: any) {
    ctx.body = name;
  }
}

function m(ctx, next) {
  return next()
}
