import { Context } from "koa";
import { getAllSalonView } from "../views/get-all-salons-view";
import { SalonsCollection_DEPRECATED } from "../core/db/mongodb";

export async function getAllSalon(ctx: Context) {
  const $salons = await SalonsCollection_DEPRECATED();
  const salons = await $salons.find().toArray();

  ctx.body = getAllSalonView({ salons })  
}
