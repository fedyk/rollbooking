import * as Router from "koa-router";
import { State } from "../../types/app/state";
import { templateMiddleware } from "../../middleware/template-middleware";
import { salonMiddleware } from "./salon-middleware";
import { getSalonProfile } from "./get-salon-profile";

export const salonRouter = new Router<State, any>();

salonRouter.get("/:alias", templateMiddleware, salonMiddleware, getSalonProfile);
