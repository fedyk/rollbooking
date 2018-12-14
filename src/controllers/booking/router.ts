import * as Router from "koa-router";
import { welcome } from "./welcome";

export const router = new Router();

router.get("/:salonId", welcome);
router.get("/:salonId/checkout", welcome);
