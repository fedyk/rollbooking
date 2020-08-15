import * as Router from "@koa/router"
import { Context } from "./types/app";
import { welcome } from "./controllers/welcome"
import { calendar } from "./controllers/calendar"
import { explore } from "./controllers/explore"
import { login } from "./controllers/login";
import { invite } from "./controllers/invite";
import { layout, template, session } from "./middleware";
import { business } from "./controllers/business";
import { createEvent } from "./controllers/create-event";
import { event } from "./controllers/event";
import { profile as businessProfile } from "./controllers/business-settings/profile";
import { users as businessUsers } from "./controllers/business-settings/users";
import { user as businessUser } from "./controllers/business-settings/user";
import { services as businessServices } from "./controllers/business-settings/services";
import { service as businessService } from "./controllers/business-settings/service";
import { layout as businessLayout } from "./controllers/business-settings/layout";

export const router = new Router<any, Context>();

/** Add user to context */
router.use(session)

/** General Pages */
router.all("/", template, layout, welcome)
router.get("/explore", template, layout, explore)
router.all("/login", template, login)
router.all("/invite/:token", template, layout, invite)

router.get("/calendar", template, layout, calendar)
router.get("/business/:id", template, layout, business)
router.all("/business/:id/event/new", template, layout, createEvent)
router.get("/business/:businessId/event/:eventId", template, layout, event)
router.all("/business/:businessId/settings/profile", template, layout, businessLayout, businessProfile)
router.all("/business/:businessId/settings/users", template, layout, businessLayout, businessUsers)
router.all("/business/:businessId/settings/users/:userId", template, layout, businessLayout, businessUser)
router.all("/business/:businessId/settings/services", template, layout, businessLayout, businessServices)
router.all("/business/:businessId/settings/services/:serviceId", template, layout, businessLayout, businessService)
