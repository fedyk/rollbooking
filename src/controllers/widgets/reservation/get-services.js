const { google } = require('googleapis')
const { connect } = require('../../../lib/database')
const { authorize } = require('../../../lib/googleapis')
const getReservationWidgetData = require('../../../sagas/get-reservation-widget-data')
const getReservationConfirmData = require('../../../sagas/get-reservation-confirm-data')
const debug = require('debug')('controllers:widgets')

module.exports = getServices;

async function getServices(ctx) {
  // const salonId = parseInt(ctx.params.salonId)
  // const client = await connect()
  // const googleAuth = await authorize()
  // const viewLocal = {
  //   error: null,
  //   salonId,
  //   masterId: null,
  //   salon: null,
  //   salonUsers: [],
  //   salonServices: [],
  // }

  // try {
  //   debug('fetch data for widget')

  //   Object.assign(viewLocal, await getReservationWidgetData(client, googleAuth, salonId))
  // }
  // catch (e) {
  //   viewLocal.error = e;
  // }

  // client.release()

  // ctx.render('widgets/reservation.html', viewLocal)
  ctx.body = {
    test: 1
  };
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