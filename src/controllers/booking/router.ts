import * as Router from "koa-router";
import { welcome } from "./welcome/welcome";
import { form } from "./checkout/form";
import { onlyAuthenticated } from "../../lib/passport";
import { reservation } from "./reservation/reservation";
import { createReservation } from "./checkout/create_reservation";
import { slotSubscriptions } from "./slot-subscriptions/slot-subscriptions";

import { templateMiddleware } from "../../middlewares/template-middleware";
import { contentMiddleware } from "../../middlewares/content-middleware";
import { checkoutMiddleware } from "./middlewares/checkout-middleware";
import { bookingContentMiddleware } from "./middlewares/booking-template-middleware";

export const router = new Router<any, any>();

router.get("/", templateMiddleware, contentMiddleware, bookingContentMiddleware, welcome);
router.get("/checkout", templateMiddleware, contentMiddleware, bookingContentMiddleware, checkoutMiddleware, form);
router.post("/checkout", templateMiddleware, contentMiddleware, bookingContentMiddleware, checkoutMiddleware, createReservation, form);
router.get("/reservation", templateMiddleware, contentMiddleware, bookingContentMiddleware, reservation);
router.post("/slot-subscriptions", onlyAuthenticated, slotSubscriptions);
