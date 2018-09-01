import { Context } from 'koa';
import { connect } from '../../../lib/database';
import { authorize } from '../../../lib/googleapis';
import { getServices as fetchServices } from '../../../sagas/widgets/reservation/get-services';
// import debug from 'debug')('controllers:widgets';

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
    debug('fetch services data for the widget')

    Object.assign(viewLocal, await getReservationWidgetServices(client, googleAuth, salonId))
  }
  catch (e) {
    viewLocal.error = e;

    ctx.response.status = 500;
  }

  client.release()

  ctx.render('widgets/reservation/get-services.njk', viewLocal)
}

// async function reservationConfirm(ctx) {
//   const { user } = ctx.state
//   const salonId = parseInt(ctx.params.salonId)
//   const masterId = ctx.query.m ? parseInt(ctx.query.m) : null
//   const serviceId = parseInt(ctx.query.s)
//   const time = new Date(ctx.query.t)
//   const client = await connect()
//   const googleAuth = await authorize()
//   const viewLocal = {
//     time,
//     serviceId,
//     masterId,
//     error: null,
//     user
//   }

//   try {
//     const {
//       service,
//       master,
//     } = await getReservationConfirmData(client, googleAuth, salonId, masterId, serviceId, time)
    
//     Object.assign(viewLocal, {
//       service,
//       master
//     })
//   }
//   catch (e) {
//     viewLocal.error = error;
//   }

//   client.release()

//   ctx.render('widgets/reservation-confirm.html', viewLocal)
// }

// async function reservationPreview(ctx) {
//   const salonId = parseInt(ctx.params.salonId)

//   ctx.render('widgets/reservation-preview.html', {
//     salonId
//   })
// }

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
