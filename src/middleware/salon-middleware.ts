import Debug from "debug";
import { Middleware } from "koa";
import { SalonsCollection_DEPRECATED } from "../base/db/mongodb";
import { Salon } from "../base/types/salon";
import { State } from "../base/types/app/state";

const debug = Debug("app:salon")

export interface SalonState extends State {
  salon: Salon;
}

/**
 * Allow to have URLs like this /salon-alias/about
 * 
 * @example
 *   route.get("/")
 */
export const salonAliasMiddleware: Middleware<SalonState> = async (ctx, next): Promise<void> => {
  const alias = (ctx.params.alias + "").trim();

  ctx.assert(alias && alias.length < 32 && alias.length > 2, 404, "Page doesn't exist");

  debug("find a salon by alias");

  const $salons = await SalonsCollection_DEPRECATED();
  const salon = await $salons.findOne({ alias });

  debug("check if salon exist");

  ctx.assert(salon, 404, "Page doesn't exist");

  ctx.state.salon = salon;

  debug("call next middleware");

  await next()
}
