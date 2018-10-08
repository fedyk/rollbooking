import { Context } from "koa";
import { renderer } from "../../lib/render";
import { Settings as SettingsViewModel } from "../../view-models/salon-settings/services";
import { connect } from "../../lib/database";
import { getSalonServices } from "../../sagas/get-salon-services";
import { SalonService } from "../../models/salon-service";
import { addSalonService } from "../../sagas/add-salon-service";

export async function services(ctx: Context) {
  const salonId = parseInt(ctx.params.salonId, 10);
  const client = await connect();

  if (ctx.request.method === 'POST') {
    try {
      addSalonService(client, parseService(ctx.request.body, salonId))
    }
    catch(e) {
      e.status = 400;
      e.expose = true;
      client.release();
      throw e;
    }
  }

  const salonServices = await getSalonServices(client, salonId);

  client.release();

  ctx.body = await renderer("salon-settings/services.njk", {
    salonId,
    salonServices
  } as SettingsViewModel);
}

function parseService(payload: any, salonId: number): SalonService {
  if (!payload) {
    throw new Error("Invalid payload");
  }

  const name = typeof payload.name === "string" ? payload.name.trim() : '';
  const duration = parseInt(payload.duration || '', 10);
  const price = parseFloat(payload.price || '');

  if (!name || name.length > 512) {
    throw new Error("Name is required");
  }

  // duration is passed as minutes, from 15min to 240min
  if (isNaN(duration) || duration < 15 || duration > 240) {
    throw new Error("Invalid duration");
  }

  // price should have a common seance
  if (isNaN(price) || price > 100000) {
    throw new Error("Invalid price");
  }

  return {
    id: null,
    salon_id: salonId,
    properties: {
      general: {
        name,
        description: '',
        duration: duration
      },
      price: {
        value: price
      }
    },
    created: new Date,
    updated: new Date

  }
}