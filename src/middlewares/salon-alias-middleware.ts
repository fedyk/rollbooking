import { Context } from "koa";
import Debug from "debug";
import { SalonsCollection } from "../adapters/mongodb";
import { Salon } from "../models/salon";

const debug = Debug("app:salon-alias-middleware")

export interface SalonState {
  salon: Salon
}

export async function salonAliasMiddleware(ctx: Context, next) {
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
