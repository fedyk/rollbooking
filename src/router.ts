import * as Router from "@koa/router"
import { Context, ParameterizedContext } from "./types/app";
import { welcome } from "./controllers/welcome"
import { calendar } from "./controllers/calendar"
import { explore } from "./controllers/explore"
import { login } from "./controllers/login";
import { invite } from "./controllers/invite";
import { defaultLayout, template, session } from "./middleware";
import { business } from "./controllers/business";
import { confirmEvent } from "./controllers/create-event";
import { event } from "./controllers/event";
import { profile as businessProfile } from "./controllers/business-settings/profile";
import { users as businessUsers } from "./controllers/business-settings/users";
import { user as businessUser } from "./controllers/business-settings/user";
import { services as businessServices } from "./controllers/business-settings/services";
import { service as businessService } from "./controllers/business-settings/service";
import { layout as businessLayout } from "./controllers/business-settings/layout";
import { transpileModule } from "typescript";

export const router = new Router<any, Context>()

/** Add user to context */
router.use(session)

/** General Pages */
router.all("/", template, defaultLayout, welcome)
router.get("/explore", template, defaultLayout, explore)
router.all("/login", template, login)
router.all("/invite/:token", template, defaultLayout, invite)

router.get("/calendar", template, defaultLayout, calendar)
router.get("/business/:id", template, defaultLayout, business)
router.all("/business/:id/event/confirm", template, defaultLayout, confirmEvent)
router.get("/business/:businessId/event/:eventId", template, defaultLayout, event)
router.all("/business/:businessId/settings/profile", template, defaultLayout, businessLayout, businessProfile)
router.all("/business/:businessId/settings/users", template, defaultLayout, businessLayout, businessUsers)
router.all("/business/:businessId/settings/users/:userId", template, defaultLayout, businessLayout, businessUser)
router.all("/business/:businessId/settings/services", template, defaultLayout, businessLayout, businessServices)
router.all("/business/:businessId/settings/services/:serviceId", template, defaultLayout, businessLayout, businessService)


router.get("/booking", noop("booking.show")) // how to see my reservations
router.get("/home", noop("home.show"))
router.get("/settings", noop("profile.edit"))
router.get("/:alias", noop("profile.show"))
router.all("/:alias/booking", noop("booking.show"))
router.all("/:alias/booking/confirm", noop("booking.confirm"))
router.all("/:alias/reviews", noop("reviews.confirm"))
router.all("/:alias/cal", noop("calendar.show"))
router.all("/:alias/cal/add", noop("calendar.addEvent"))
router.all("/:alias/cal/:id/edit", noop("calendar.editEvent"))
router.all("/:alias/cal/:id/delete", noop("calendar.deleteEvent"))
router.all("/:alias/cal/:id", noop("calendar.showEvent"))
router.all("/:alias/clients", noop("customer.list"))
router.all("/:alias/customers/add", noop("customer.add"))
router.all("/:alias/customers/:id", noop("customers.get"))
router.all("/:alias/customers/:id/edit", noop("customers.edit"))
router.all("/:alias/customers/:id/delete", noop("customers.delete"))
router.all("/:alias/settings", noop("orgsSettings.profile"))
router.all("/:alias/settings/users", noop("orgsSettings.users"))
router.all("/:alias/settings/users/:userId", noop("orgsSettings.profile"))
router.all("/:alias/settings/services", noop("orgsSettings.profile"))
router.all("/:alias/settings/service/:serviceId", noop("orgsSettings.profile"))

/**
 * Auth
 */
router.all("/auth", noop("auth1.welcome"))
router.all("/auth/v1/get_token_info", noop("auth1.get_token_info"))
router.all("/auth/v1/list_clients", noop("auth1.list_clients"))
router.all("/auth/v1/list_sessions", noop("auth1.list_sessions"))
router.all("/auth/v1/revoke_session", noop("auth1.revoke_session"))
router.all("/auth/v1/revoke_all_session", noop("auth1.revoke_all_session"))

/**
 * API
 */
router.post("/api/v1/get_me", noop("api1.get_me"))
router.post("/api/v1/update_me", noop("api1.update_me"))

router.post("/api/v1/list_events", noop("api1.list_events"))
router.post("/api/v1/get_event", noop("api1.get_event"))
router.post("/api/v1/create_event", noop("api1.create_event"))
router.post("/api/v1/update_event", noop("api1.update_event"))
router.post("/api/v1/delete_event", noop("api1.delete_event"))

router.post("/api/v1/list_orgs", noop("api1.list_orgs"))
router.post("/api/v1/get_org", noop("api1.get_org"))
router.post("/api/v1/create_org", noop("api1.create_org"))
router.post("/api/v1/update_org", noop("api1.update_org"))
router.post("/api/v1/delete_org", noop("api1.delete_org"))

router.post("/api/v1/list_members", noop("api1.list_members"))
router.post("/api/v1/list_public_members", noop("api1.list_public_members"))
router.post("/api/v1/get_member", noop("api1.get_member"))
router.post("/api/v1/invite_member", noop("api1.invite_member"))
router.post("/api/v1/update_member", noop("api1.update_member"))
router.post("/api/v1/delete_member", noop("api1.delete_member"))

router.post("/api/v1/get_booking_properties", noop("api1.get_booking_properties"))
router.post("/api/v1/update_booking_properties", noop("api1.update_booking_properties"))

router.post("/api/v1/list_service", noop("api1.list_service"))
router.post("/api/v1/get_service", noop("api1.get_service"))
router.post("/api/v1/create_service", noop("api1.create_service"))
router.post("/api/v1/update_service", noop("api1.update_service"))
router.post("/api/v1/delete_service", noop("api1.delete_service"))

router.post("/api/v1/list_customers", noop("api1.list_customers"))
router.post("/api/v1/get_customer", noop("api1.get_customer"))
router.post("/api/v1/create_customer", noop("api1.create_customer"))
router.post("/api/v1/update_customer", noop("api1.update_customer"))
router.post("/api/v1/delete_customer", noop("api1.delete_customer"))

router.post("/api/v1/list_reviews", noop("api1.list_reviews"))
router.post("/api/v1/create_review", noop("api1.create_review"))
router.post("/api/v1/update_review", noop("api1.update_review"))
router.post("/api/v1/delete_review", noop("api1.delete_review"))

router.all("/api/v1/wss")

function noop(d: string) {
  return function(ctx: ParameterizedContext) {
    ctx.throw(new Error("Not implemented"))
  }
}
