import * as Router from "@koa/router"
import { State, Context } from "./types/app";
import { join } from "./controllers/join"
import controllers from "./controllers"
import { welcome } from "./controllers"
import { dashboard } from "./controllers"
import { getExplore } from "./controllers/explore"
import { login } from "./controllers/login";
import { layout, template, session } from "./middleware";

export const router = new Router<any, Context>();

const { business } = controllers;

/** Add user to context */
router.use(session)

/** General Pages */
router.get("/", template, layout, welcome)
router.post("/join", join)
router.get("/explore", template, layout, getExplore)
router.all("/login", template, login)

/** Dashboard */
router.get("/dashboard", template, layout, dashboard)

/** Business */
router.get("/b/:id", template, layout, business.layout, business.services)
router.all("/b/:id/create/event", template, layout, business.layout, business.createEvent)
router.get("/b/:id/events/:eventId", template, layout, business.layout, business.getEvent)
router.get("/b/:id/masters", template, layout, business.layout, business.getMasters)
router.get("/b/:id/settings", template, layout, business.layout, business.getSettings)
