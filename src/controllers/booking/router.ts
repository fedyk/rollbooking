import * as Router from "koa-router";
import { welcome } from "./welcome";
import { form } from "./checkout/form";
import { createReservation } from "./checkout/create_reservation";
import { reservation } from "./reservation/reservation";
import { templateMiddleware } from "../../middlewares/template-middleware";
import { contentMiddleware } from "../../middlewares/content-middleware";
import { checkoutMiddleware } from "./middlewares/checkout-middleware";

export const router = new Router<any, any>();

router.get("/", templateMiddleware, contentMiddleware, welcome);
router.get("/checkout", templateMiddleware, contentMiddleware, checkoutMiddleware, form);
router.post("/checkout", templateMiddleware, contentMiddleware, checkoutMiddleware, createReservation, form);
router.get("/reservation", templateMiddleware, contentMiddleware, reservation);
