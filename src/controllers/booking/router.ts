import * as Router from "koa-router";
import { welcome } from "./welcome";
import { checkout } from "./checkout";

export const router = new Router();

router.get("/:salonId", welcome);
router.get("/:salonId/checkout", checkout);
