import * as Router from "koa-router";
import { welcome } from "./welcome";
import { checkout } from "./checkout";
import { reservation } from "./reservation";

export const router = new Router();

router.get("/:salonId", welcome);
router.get("/:salonId/checkout", checkout);
router.post("/:salonId/checkout", checkout);
router.get("/:salonId/reservation", reservation);
