import * as Router from "@koa/router"
import { Context, ParameterizedContext } from "./types/app";
import { welcome } from "./controllers/welcome"
import { calendar } from "./controllers/calendar"
import { explore } from "./controllers/explore"
import { login } from "./controllers/login";
import { invite } from "./controllers/invite";
import { template, session } from "./middleware";
import { business } from "./controllers/business";
import { confirmEvent } from "./controllers/create-event";
import { event } from "./controllers/event";
import { profile as businessProfile } from "./controllers/business-settings/profile";
import { users as businessUsers } from "./controllers/business-settings/users";
import { user as businessUser } from "./controllers/business-settings/user";
import { services as businessServices } from "./controllers/business-settings/services";
import { service as businessService } from "./controllers/business-settings/service";
import { layout as businessLayout } from "./controllers/business-settings/layout";

export const router = new Router<any, Context>()

/** Add user to context */
router.use(session)

/** General Pages */
router.all("/", template, welcome)
router.get("/explore", template, explore)
router.all("/login", template, login)
router.all("/invite/:token", template, invite)

router.get("/calendar", template, calendar)
router.get("/business/:id", template, business)
router.all("/business/:id/event/confirm", template, confirmEvent)
router.get("/business/:businessId/event/:eventId", template, event)
router.all("/business/:businessId/settings/profile", template, businessLayout, businessProfile)
router.all("/business/:businessId/settings/users", template, businessLayout, businessUsers)
router.all("/business/:businessId/settings/users/:userId", template, businessLayout, businessUser)
router.all("/business/:businessId/settings/services", template, businessLayout, businessServices)
router.all("/business/:businessId/settings/services/:serviceId", template, businessLayout, businessService)

router.get("/", todo("booking.show")) // how to see my reservations
router.get("/settings", todo("profile.edit"))
router.get("/:alias", todo("profile.show"))
router.all("/:alias/booking", todo("booking.show"))
router.all("/:alias/booking/confirm", todo("booking.confirm"))
router.all("/:alias/reviews", todo("reviews.confirm"))
router.all("/:alias/cal", todo("calendar.show"))
router.all("/:alias/cal/add", todo("calendar.addEvent"))
router.all("/:alias/cal/:id/edit", todo("calendar.editEvent"))
router.all("/:alias/cal/:id/delete", todo("calendar.deleteEvent"))
router.all("/:alias/cal/:id", todo("calendar.showEvent"))
router.all("/:alias/clients", todo("customer.list"))
router.all("/:alias/customers/add", todo("customer.add"))
router.all("/:alias/customers/:id", todo("customers.get"))
router.all("/:alias/customers/:id/edit", todo("customers.edit"))
router.all("/:alias/customers/:id/delete", todo("customers.delete"))
router.all("/:alias/settings", todo("orgsSettings.profile"))
router.all("/:alias/settings/users", todo("orgsSettings.users"))
router.all("/:alias/settings/users/:userId", todo("orgsSettings.profile"))
router.all("/:alias/settings/services", todo("orgsSettings.profile"))
router.all("/:alias/settings/service/:serviceId", todo("orgsSettings.profile"))

/**
 * Auth
 */
router.all("/auth", todo("auth1.welcome"))
router.all("/auth/v1/get_token_info", todo("auth1.get_token_info"))
router.all("/auth/v1/list_sessions", todo("auth1.list_sessions"))
router.all("/auth/v1/revoke_session", todo("auth1.revoke_session"))

/**
 * API
 */
router.post("/api/v1/get_current_user", todo("api1.get_me"))
router.post("/api/v1/update_current_user", todo("api1.update_me"))

router.post("/api/v1/list_events", todo("api1.list_events"))
router.post("/api/v1/get_event", todo("api1.get_event"))
router.post("/api/v1/create_event", todo("api1.create_event"))
router.post("/api/v1/update_event", todo("api1.update_event"))
router.post("/api/v1/delete_event", todo("api1.delete_event"))

router.post("/api/v1/list_orgs", todo("api1.list_orgs"))
router.post("/api/v1/get_org", todo("api1.get_org"))
router.post("/api/v1/create_org", todo("api1.create_org"))
router.post("/api/v1/update_org", todo("api1.update_org"))
router.post("/api/v1/delete_org", todo("api1.delete_org"))

router.post("/api/v1/list_members", todo("api1.list_members"))
router.post("/api/v1/list_public_members", todo("api1.list_public_members"))
router.post("/api/v1/get_member", todo("api1.get_member"))
router.post("/api/v1/invite_member", todo("api1.invite_member"))
router.post("/api/v1/update_member", todo("api1.update_member"))
router.post("/api/v1/delete_member", todo("api1.delete_member"))

router.post("/api/v1/get_booking_properties", todo("api1.get_booking_properties"))
router.post("/api/v1/update_booking_properties", todo("api1.update_booking_properties"))

router.post("/api/v1/list_service", todo("api1.list_service"))
router.post("/api/v1/get_service", todo("api1.get_service"))
router.post("/api/v1/create_service", todo("api1.create_service"))
router.post("/api/v1/update_service", todo("api1.update_service"))
router.post("/api/v1/delete_service", todo("api1.delete_service"))

router.post("/api/v1/list_customers", todo("api1.list_customers"))
router.post("/api/v1/get_customer", todo("api1.get_customer"))
router.post("/api/v1/create_customer", todo("api1.create_customer"))
router.post("/api/v1/update_customer", todo("api1.update_customer"))
router.post("/api/v1/delete_customer", todo("api1.delete_customer"))

router.post("/api/v1/list_reviews", todo("api1.list_reviews"))
router.post("/api/v1/create_review", todo("api1.create_review"))
router.post("/api/v1/update_review", todo("api1.update_review"))
router.post("/api/v1/delete_review", todo("api1.delete_review"))

router.all("/api/v1/wss", todo("api1.wss"))

function todo(d: string) {
  return function(ctx: ParameterizedContext) {
    ctx.throw(new Error(`${d} is not implemented`))
  }
}
