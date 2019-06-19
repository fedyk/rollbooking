import Debug from "debug";
import { Middleware } from "koa";
import { SalonsCollection } from "../../adapters/mongodb";
import { Salon } from "../../types/salon";
import { State } from "../../types/app/state";

const debug = Debug("app:salon")

export interface SalonState extends State {
  salon: Salon;
}

export const salonMiddleware: Middleware<SalonState> = async (ctx, next): Promise<void> => {
  const alias: string = `${ctx.params.alias || ""}`.trim();

  ctx.assert(alias, 404, "Page doesn't exist");
  ctx.assert(alias.length < 32, 404, "Page doesn't exist");
  ctx.assert(alias.length > 2, 404, "Page doesn't exist");

  debug("find a salon by alias");

  const $salons = await SalonsCollection();
  const salon = await $salons.findOne({ alias });

  debug("check if salon exist");

  ctx.assert(salon, 404, "Page doesn't exist");

  ctx.state.salon = salon;

  debug("call next middleware");

  await next()
}
