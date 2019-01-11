import * as Router from "koa-router";
import { welcome } from "./welcome";
import { checkout } from "./checkout";
import { reservation } from "./reservation";

export const router = new Router();

router.get("/", welcome);
router.get("/checkout", checkout);
router.post("/checkout", checkout);
router.get("/reservation", reservation);
