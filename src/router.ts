import * as Router from "@koa/router"
import { Context } from "./types/app";
import { join } from "./controllers/join"
import { welcome } from "./controllers/welcome/welcome"
import { dashboard } from "./controllers/dashboard/dashboard"
import { getExplore } from "./controllers/explore"
import { login } from "./controllers/login";
import { layout, template, session } from "./middleware";
import { services } from "./controllers/services";
import { createEvent, getEvent } from "./controllers/events";

export const router = new Router<any, Context>();

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
router.get("/b/:id", template, layout, services)
router.all("/b/:id/create/event", template, layout, createEvent)
router.get("/e/:eventId", template, layout, getEvent)
