const { connect } = require('../lib/database');
const debug = require('debug')('controller:schedule');
const inviteUserToSalon = require('../sagas/invite-user-to-salon');
const getSalonUsers = require('../sagas/get-salon-users');
const updateSalonUserDetails = require('../sagas/update-salon-user-details');
const removeSalonUser = require('../sagas/remove-salon-user');

module.exports = schedule;
module.exports.inviteUser = inviteUser;
module.exports.getUserDetails = getUserDetails;
module.exports.updateUserDetails = updateUserDetails;
module.exports.removeUser = removeUser;

async function schedule(ctx) {
  const salonId = parseInt(ctx.params.salonId)
  const client = await connect();
  const { user } = ctx.state
  const view = 'schedule/index.html'
  const locals = {
    salonId,
    user
  }

  try {
    locals.salonUsers = await getSalonUsers(client, salonId)
  }
  catch(e) {
    locals.error = e.message || 'Something went wrong. Please try later';

    debug('Fail to get all needed data for rendering schedule page. Details: %O', e);
  }

  ctx.render('schedule/index.html', locals);

  client.release()
}

async function inviteUser(ctx) {
  const userData = ctx.request.body
  const currUser = ctx.state.user
  const salonId = parseInt(ctx.params.salonId)
  const client = await connect()
  const viewPath = 'schedule/invite-user.html'
  const viewContext = {
    salonId,
    salonUsers: [],
    error: null,
  }

  // Pass timezone from current user
  userData.timezone = currUser.timezone;

  try {
    await inviteUserToSalon(client, salonId, userData, currUser.id, userData.role || 'member');

    viewContext.salonUsers = await getSalonUsers(client, salonId)
  }
  catch (error) {
    viewContext.error = error.message;
  }

  ctx.render(viewPath, viewContext)
  ctx.type = 'application/json';

  client.release();
}

async function getUserDetails(ctx) {
  const getUserName = require('../utils/get-user-name')
  const getUserRole = require('../utils/get-user-role')
  const salonId = parseInt(ctx.params.salonId)
  const userId = parseInt(ctx.params.userId)
  const client = await connect()
  const viewPath = 'schedule/user-details.html'
  const viewLocal = {
    error: null,
    details: {}
  }

  try {
    const salonUsers = await getSalonUsers(client, salonId)
    const salonUser = salonUsers.find(v => v.user_id === userId);

    if (!salonUser) throw new Error('User doe\'s not exist');
    
    viewLocal.details = {
      name: getUserName(salonUser.user),
      email: salonUser.user.email,
      role: getUserRole(salonUser)
    }
  }
  catch(e) {
    viewLocal.error = (e.message || 'Something went wrong. Please try later');
  }

  ctx.render(viewPath, viewLocal);

  client.release()
}

async function updateUserDetails(ctx) {
  const userDetails = ctx.request.body
  const salonId = parseInt(ctx.params.salonId)
  const userId = parseInt(ctx.params.userId)
  const client = await connect()
  const viewPath = 'schedule/invite-user.html'
  const viewLocal = {
    salonId,
    error: null,
    salonUsers: []
  }

  try {
    await updateSalonUserDetails(client, salonId, userId, userDetails)

    viewLocal.salonUsers = await getSalonUsers(client, salonId)
  }
  catch(e) {
    viewLocal.error = (e.message || 'Something went wrong. Please try later');
  }

  ctx.render(viewPath, viewLocal);

  client.release()
}


async function removeUser(ctx) {
  const salonId = parseInt(ctx.params.salonId)
  const userId = parseInt(ctx.params.userId)
  const client = await connect()
  const viewPath = 'schedule/invite-user.html'
  const viewLocal = {
    salonId,
    error: null,
    salonUsers: []
  }

  try {
    await removeSalonUser(client, salonId, userId)

    viewLocal.salonUsers = await getSalonUsers(client, salonId)
  }
  catch(e) {
    viewLocal.error = (e.message || 'Something went wrong. Please try later');
  }

  ctx.render(viewPath, viewLocal);

  client.release()
}
