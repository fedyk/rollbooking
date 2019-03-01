import { Context } from "koa";
import { salonsView } from "./salons-view";
import { SalonsCollection } from "../../adapters/mongodb";

export async function salons(ctx: Context) {
  const $salons = await SalonsCollection();
  const salons = await $salons.find().toArray();

  ctx.body = salonsView({ salons })  
}
