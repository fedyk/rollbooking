import * as Router from "@koa/router"
import { Context } from "./types/app";
import { welcome } from "./controllers/welcome"
import { login } from "./controllers/login";
import { invite_TO_REWORK } from "./controllers/invite";
import { template, session } from "./middleware";
import { salon } from "./controllers/salon";
import { confirmReservation } from "./controllers/confirm-reservation";
import { reservations } from "./controllers/reservations";
import { profile as businessProfile } from "./controllers/business-settings/profile";
import { users as businessUsers } from "./controllers/business-settings/users";
import { user as businessUser } from "./controllers/business-settings/user";
import { services as businessServices } from "./controllers/business-settings/services";
import { service as businessService } from "./controllers/business-settings/service";
import { layout as businessLayout } from "./controllers/business-settings/layout";
import { privacy } from "./privacy";

export const router = new Router<{}, Context>()

router.use(session)

/**
 * Re-test
 */
router.all("/invite/:token", template, invite_TO_REWORK)
router.get("/salon/:id", template, salon)
router.all("/salon/:id/confirm", template, confirmReservation)
router.all("/salon/:id/settings/profile", template, businessLayout, businessProfile)
router.all("/salon/:id/settings/users", template, businessLayout, businessUsers)
router.all("/salon/:id/settings/users/:userId", template, businessLayout, businessUser)
router.all("/salon/:id/settings/services", template, businessLayout, businessServices)
router.all("/salon/:id/settings/services/:serviceId", template, businessLayout, businessService)
router.all("/privacy", template, privacy)

/**
 * Critical
 */
router.all("/", template, welcome)
router.all("/login", template, login)
router.all("/join", template, __TODO__("join"))
router.get("/reservations", template, reservations)
// router.get("/reservation/:reservationId", template, reservation)
router.get("/calendar/:id", template, __TODO__("calendar"))

/**
 * Major
 */
router.get("/settings", __TODO__("profile.edit"))

/**
 * Minor
 */
router.all("/salon/:id/customers", __TODO__("customers"))
router.all("/salon/:id/reviews", __TODO__("customers"))

/**
 * Auth
 */
router.all("/auth", __TODO__("auth"))
router.all("/auth/v1/get_token_info", __TODO__("auth1.get_token_info"))
router.all("/auth/v1/list_sessions", __TODO__("auth1.list_sessions"))
router.all("/auth/v1/revoke_session", __TODO__("auth1.revoke_session"))
router.post("/api/v1/get_current_user", __TODO__("api1.get_me"))
router.post("/api/v1/update_current_user", __TODO__("api1.update_me"))
router.post("/api/v1/list_events", __TODO__("api1.list_events"))
router.post("/api/v1/get_event", __TODO__("api1.get_event"))
router.post("/api/v1/create_event", __TODO__("api1.create_event"))
router.post("/api/v1/update_event", __TODO__("api1.update_event"))
router.post("/api/v1/delete_event", __TODO__("api1.delete_event"))
router.post("/api/v1/list_orgs", __TODO__("api1.list_orgs"))
router.post("/api/v1/get_org", __TODO__("api1.get_org"))
router.post("/api/v1/create_org", __TODO__("api1.create_org"))
router.post("/api/v1/update_org", __TODO__("api1.update_org"))
router.post("/api/v1/delete_org", __TODO__("api1.delete_org"))
router.post("/api/v1/list_members", __TODO__("api1.list_members"))
router.post("/api/v1/list_public_members", __TODO__("api1.list_public_members"))
router.post("/api/v1/get_member", __TODO__("api1.get_member"))
router.post("/api/v1/invite_member", __TODO__("api1.invite_member"))
router.post("/api/v1/update_member", __TODO__("api1.update_member"))
router.post("/api/v1/delete_member", __TODO__("api1.delete_member"))
router.post("/api/v1/get_booking_properties", __TODO__("api1.get_booking_properties"))
router.post("/api/v1/update_booking_properties", __TODO__("api1.update_booking_properties"))
router.post("/api/v1/list_service", __TODO__("api1.list_service"))
router.post("/api/v1/get_service", __TODO__("api1.get_service"))
router.post("/api/v1/create_service", __TODO__("api1.create_service"))
router.post("/api/v1/update_service", __TODO__("api1.update_service"))
router.post("/api/v1/delete_service", __TODO__("api1.delete_service"))
router.post("/api/v1/list_customers", __TODO__("api1.list_customers"))
router.post("/api/v1/get_customer", __TODO__("api1.get_customer"))
router.post("/api/v1/create_customer", __TODO__("api1.create_customer"))
router.post("/api/v1/update_customer", __TODO__("api1.update_customer"))
router.post("/api/v1/delete_customer", __TODO__("api1.delete_customer"))
router.post("/api/v1/list_reviews", __TODO__("api1.list_reviews"))
router.post("/api/v1/create_review", __TODO__("api1.create_review"))
router.post("/api/v1/update_review", __TODO__("api1.update_review"))
router.post("/api/v1/delete_review", __TODO__("api1.delete_review"))
router.all("/api/v1/wss", __TODO__("api1.wss"))

function __TODO__(d: string) {
  return function(ctx: Context) {
    ctx.throw(new Error(`${d} is not implemented`), 404)
  }
}
