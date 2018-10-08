import { Context } from "koa";
import { renderer } from "../../lib/render";
import { Settings as SettingsViewModel } from "../../view-models/salon-settings/settings";
import { connect } from "../../lib/database";
import { getSalonServices } from "../../sagas/get-salon-services";

export async function services(ctx: Context) {
  const salonId = parseInt(ctx.params.salonId, 10);
  const client = await connect();
  const salonServices = await getSalonServices(client, salonId);

  ctx.body = await renderer("salon-settings/services.njk", {
    salonId,
    salonServices
  } as SettingsViewModel);
}
