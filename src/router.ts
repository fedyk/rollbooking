import * as Router from "@koa/router"
import { Context } from "./types/app";
import { welcome } from "./controllers/welcome"
import { calendar } from "./controllers/calendar"
import { explore } from "./controllers/explore"
import { login } from "./controllers/login";
import { layout, template, session } from "./middleware";
import { business } from "./controllers/business";
import { createEvent } from "./controllers/create-event";
import { event } from "./controllers/event";
import { users as businessSettingsUsers } from "./controllers/business-settings/users";
import { layout as businessSettingsLayout } from "./controllers/business-settings/layout";

export const router = new Router<any, Context>();

/** Add user to context */
router.use(session)

/** General Pages */
router.all("/", template, layout, welcome)
router.get("/explore", template, layout, explore)
router.all("/login", template, login)

router.get("/calendar", template, layout, calendar)
router.get("/business/:id", template, layout, business)
router.all("/business/:id/event/new", template, layout, createEvent)
router.get("/business/:businessId/event/:eventId", template, layout, event)
router.all("/business/:businessId/settings", template, layout, businessSettingsLayout, businessSettingsUsers)
