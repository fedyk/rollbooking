import { getSalonServices } from './get-salon-services';
import { getSalonUsers } from './get-salon-users';
import debugFactory from "debug";

const debug = debugFactory('sagas:get-reservation-confirm-data')

/**
 * 
 * @param {PgClient} client 
 */
export async function getReservationConfirmData(client, googleAuth, salonId, masterId, serviceId, time) {

  debug('fetch salon services')

  const salonServices = await getSalonServices(client, salonId)

  debug('find needed service')

  const service = salonServices.find(v => v.id === serviceId)

  debug('fetch salon users')

  const salonUsers = await getSalonUsers(client, salonId)

  debug('find needed user')

  const master = findNeededUser(salonUsers, masterId);

  return {
    service,
    master
  }
}


function findNeededUser(salonUsers, masterId) {
  if (typeof masterId == 'number') {
    return salonUsers.find(v => v.user_id === masterId);
  }
  else if (salonUsers.length > 0) {
    return salonUsers[0];
  }
  return null
}