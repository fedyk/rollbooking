import * as Router from "koa-router";
import { welcome } from "./welcome";
import { get as getCheckout } from "./checkout/get";
import { post as postCheckout } from "./checkout/post";
import { reservation } from "./reservation";

export const router = new Router<any, any>();

router.get("/", welcome);
router.get("/checkout", getCheckout);
router.post("/checkout", postCheckout);
router.get("/reservation", reservation);
