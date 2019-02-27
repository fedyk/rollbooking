import { Context } from "koa";
import { SalonsCollection } from "../../adapters/mongodb";
import { template } from "../../views/template";
import { salonsView } from "./salons-view";
import { content } from "../../views/shared/content";

export async function salons(ctx: Context) {
  const $salons = await SalonsCollection();
  const salons = await $salons.find().toArray();

  ctx.body = template({
    title: "Salons",
    body: content({
      body: salonsView({ salons })
    })
  })
}
