const { connect } = require('../lib/database')
const { google } = require('googleapis')
const { authorize } = require('../lib/googleapis')
const getReservationWidgetData = require('../sagas/get-reservation-widget-data')
const debug = require('debug')('controllers:widgets')

module.exports.reservation = reservation;
module.exports.reservationPreview = reservationPreview;

async function reservation(ctx) {
  const salonId = parseInt(ctx.params.salonId)
  const client = await connect()
  const googleAuth = await authorize()
  const viewPath = 'widgets/reservation.html'
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
    debugger
    viewLocal.error = e;
  }

  client.release()

  ctx.render(viewPath, viewLocal)
}

async function reservationPreview(ctx) {
  const salonId = parseInt(ctx.params.salonId)

  ctx.render('widgets/reservation-preview.html', {
    salonId
  })
}