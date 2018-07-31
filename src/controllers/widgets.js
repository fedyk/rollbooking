const { connect } = require('../lib/database')
const { google } = require('googleapis')
const { authorize } = require('../lib/googleapis')
const getReservationWidgetData = require('../sagas/get-reservation-widget-data')
const debug = require('debug')('controllers:widgets')

module.exports.reservation = reservation;
module.exports.reservationConfirm = reservationConfirm;
module.exports.reservationPreview = reservationPreview;

async function reservation(ctx) {
  const salonId = parseInt(ctx.params.salonId)
  const client = await connect()
  const googleAuth = await authorize()
  const viewLocal = {
    error: null,
    salonId,
    salon: null,
    salonUsers: [],
    salonServices: [],
  }

  try {
    debug('fetch data for widget')

    Object.assign(viewLocal, await getReservationWidgetData(client, googleAuth, salonId))
  }
  catch (e) {
    viewLocal.error = e;
  }

  client.release()

  ctx.render('widgets/reservation.html', viewLocal)
}

async function reservationConfirm(ctx) {
  const { user } = ctx.state
  const salonId = parseInt(ctx.params.salonId)
  const client = await connect()
  const googleAuth = await authorize()
  const viewLocal = {
    error: null,
    user
  }

  try {

  }
  catch (e) {

  }

  client.release()

  ctx.render('widgets/reservation-confirm.html', viewLocal)
}

async function reservationPreview(ctx) {
  const salonId = parseInt(ctx.params.salonId)

  ctx.render('widgets/reservation-preview.html', {
    salonId
  })
}