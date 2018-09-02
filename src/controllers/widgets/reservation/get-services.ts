import { Context } from 'koa';
import { connect } from '../../../lib/database';
import { authorize } from '../../../lib/googleapis';
import { getServices as fetchServices } from '../../../sagas/widgets/reservation/get-services';
import { renderer } from '../../../lib/render';

export async function getServices(ctx: Context) {
  const salonId = parseInt(ctx.params.salonId);
  const params = parseParams(ctx.query);
  const client = await connect();
  const googleAuth = await authorize();
  const viewLocal = {
    error: null,
    salonServices: [],
    salonServicesSlots: [],
  }

  try {
    Object.assign(viewLocal, await fetchServices(
      client,
      googleAuth,
      salonId,
      new Date(ctx.query.date),
      parseInt(ctx.query.s, 10),
      parseInt(ctx.query.m, 10)
    ))
  }
  catch (e) {
    viewLocal.error = e;

    ctx.response.status = 500;
  }

  client.release()

  ctx.body = renderer('widgets/reservation/get-services.njk', viewLocal)
}

/**
 * 
 * @param {object} params 
 */
function parseParams(params) {
  const date = params.date || params.d || null;
  const masterId = params.masterId || params.m || null;
  const serviceId = params.serviceId || params.s || null;
  
  return {
    date,
    masterId,
    serviceId
  }
}
