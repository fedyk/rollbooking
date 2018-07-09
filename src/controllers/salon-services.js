const { connect } = require('../lib/database');
const debug = require('debug')('controller:schedule-services');
const serviceUtils = require('../utils/service');
const getSalonServicesSaga = require('../sagas/get-salon-services');
const addSalonServiceSaga = require('../sagas/add-salon-service');
const updateSalonServiceSaga = require('../sagas/update-salon-service');
const removeSalonServiceSaga = require('../sagas/remove-salon-service');

module.exports.getSalonServices = getSalonServices;
module.exports.getSalonService = getSalonService;
module.exports.addSalonService = addSalonService;
module.exports.updateSalonService = updateSalonService;
module.exports.removeSalonService = removeSalonService;

async function getSalonServices(ctx) {
  const user = ctx.state.user
  const salonId = parseInt(ctx.params.salonId)
  const client = await connect()
  const viewContext = {
    user,
    salonId,
    error: '',
    services: [],
    contentViewPath: 'schedule/services.html',
  }

  try {
    debug('fetch the list of services')

    viewContext.services = await getSalonServicesSaga(client, salonId)
  }
  catch (error) {
    debug(`error in fetching salon' services, %O`, error)

    viewContext.error = error.message;
  }

  ctx.render('schedule/settings.html', viewContext)

  client.release();
}

async function getSalonService(ctx) {
  const salonId = parseInt(ctx.params.salonId)
  const serviceId = parseInt(ctx.params.serviceId)
  const client = await connect()
  const body = {
    error: null,
    service: null
  }

  try {
    debug('fetch the list of services')

    const services = await getSalonServicesSaga(client, salonId);

    debug('find proper service from list')

    const service = services.find(v => v.id === serviceId)

    if (!service) throw new Error('Service does not exist');

    body.service = {
      name: serviceUtils.getServiceName(service),
      duration: serviceUtils.getServiceDuration(service),
      price: serviceUtils.getServicePrice(service),
      description: serviceUtils.getServiceDescription(service),
    }
  }
  catch (error) {
    debug(`error in fetching salon' services, %O`, error)

    body.error = error.message;
  }

  ctx.json(body)
  client.release()
}

async function addSalonService(ctx) {
  const salonId = parseInt(ctx.params.salonId)
  const service = ctx.request.body
  const client = await connect()
  const viewPath = 'schedule/services-json-meta.html'
  const viewLocal = {
    salonId,
    error: null,
    services: null
  }

  try {
    await addSalonServiceSaga(client, salonId, service)

    viewLocal.services = await getSalonServicesSaga(client, salonId)

  } catch(error) {
    viewLocal.error = error.message
  }

  client.release()

  ctx.render(viewPath, viewLocal);
}

async function updateSalonService(ctx) {
  const salonId = parseInt(ctx.params.salonId)
  const serviceId = parseInt(ctx.params.serviceId)
  const service = ctx.request.body
  const client = await connect()
  const viewPath = 'schedule/services-json-meta.html'
  const viewLocal = {
    salonId,
    error: null,
    services: null
  }

  try {
    await updateSalonServiceSaga(client, salonId, serviceId, service)

    viewLocal.services = await getSalonServicesSaga(client, salonId)

  } catch(error) {
    viewLocal.error = error.message
  }

  client.release()

  ctx.render(viewPath, viewLocal);
}

async function removeSalonService(ctx) {
  const salonId = parseInt(ctx.params.salonId)
  const serviceId = parseInt(ctx.params.serviceId)
  const client = await connect()
  const viewPath = 'schedule/services-json-meta.html'
  const viewLocal = {
    salonId,
    error: null,
    services: null
  }

  try {
    await removeSalonServiceSaga(client, salonId, serviceId)

    viewLocal.services = await getSalonServicesSaga(client, salonId)

  } catch(error) {
    viewLocal.error = error.message
  }

  client.release()

  ctx.render(viewPath, viewLocal);
}
