const { connect } = require('../lib/database')
const { getSalonById } = require('../queries/salons')
const getSalonUsers = require('../sagas/get-salon-users')
const getSalonServices = require('../sagas/get-salon-services')
const debug = require('debug')('controllers:widgets')

module.exports.reservation = reservation;
module.exports.reservationPreview = reservationPreview;

async function reservation(ctx) {
  const salonId = parseInt(ctx.params.salonId)
  const client = await connect()
  const viewPath = 'widgets/reservation.html'
  const viewLocal = {
    error: null,
    salonId,
    salon: null,
    salonUsers: [],
    salonServices: [],
  }

  debug('fetch salon info')

  const salon = await getSalonById(client, salonId);
  
  if (!salon) ctx.throw(404, 'Not found')

  viewLocal.salon = salon

  debug('fetch salon users data')
  
  viewLocal.salonUsers = await getSalonUsers(client, salonId)
  
  debug('fetch salon services')

  viewLocal.salonServices = await getSalonServices(client, salonId)

  debug('render view')

  ctx.render(viewPath, viewLocal);
}


async function reservationPreview(ctx) {
  const salonId = parseInt(ctx.params.salonId)

  ctx.render('widgets/reservation-preview.html', {
    salonId
  })
}