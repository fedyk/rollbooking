import { Context } from "koa";
import { getAllSalonView } from "../views/get-all-salons-view";
import { SalonsCollection } from "../adapters/mongodb";

export async function getAllSalon(ctx: Context) {
  const $salons = await SalonsCollection();
  const salons = await $salons.find().toArray();

  ctx.body = getAllSalonView({ salons })  
}
