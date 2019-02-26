import * as Router from "koa-router";
import { welcome } from "./welcome";
import { get as getCheckout } from "./checkout/get";
import { createReservation } from "./checkout/create_reservation";
import { reservation } from "./reservation";

export const router = new Router<any, any>();

router.get("/", welcome);
router.get("/checkout", getCheckout);
router.post("/create_reservation", createReservation);
router.get("/reservation", reservation);
