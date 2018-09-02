import { getSalonById } from '../../../queries/salons'
import { getSalonUsers } from '../../get-salon-users'
import { getSalonService } from '../../get-salon-service'
import { getSalonServices } from '../../get-salon-services'
import { getDateStartEnd } from '../../../utils/get-date-start-end'
import { getUserCalendarId } from '../../../utils/get-user-calendar-id'
import debugFactory from "debug"
import { PoolClient } from 'pg';
import { OAuth2Client } from 'google-auth-library';
import { getProperty } from '../../../utils/get-property';
import { getSalonFreebusy } from "../../get-salon-freebusy";
import { SalonService } from '../../../models/salon-service';

const debug = debugFactory('sagas:widgets')

/**
 * @param {PoolClient} client
 * @param {number} salonId
 * @param {Object} service
 * @return {Object<{id: number, data: object}>}
 */
export async function getServices(
  client: PoolClient,
  googleAuth: OAuth2Client,
  salonId: number,
  date: Date,
  serviceId: number,
  masterId: number
): Promise<SalonService[]> {
  const salonMasters = [];
  const salonServices = [];
  const salonServicesSlots = [];

  debug('fetch salon info')

  const salon = await getSalonById(client, salonId);

  debug('fetch info about masters')

  const salonUsers = await getSalonUsers(client, salonId);

  if (masterId) {
    salonMasters.push(salonUsers.find(v => v.user_id == masterId));
  }
  else {
    salonMasters.push(...salonUsers);
  }

  debug('fetch salon services')

  if (serviceId) {
    salonServices.push(await getSalonService(client, salonId, serviceId));
  }
  else {
    salonServices.push(...await getSalonServices(client, salonId));
  }

  debug('define ids of calendars for freebusy')

  const calendarIds = salonMasters.map(v => getUserCalendarId(v))

  debug('fetch freebusy for masters')

  const { start, end } = getDateStartEnd(date);
  
  const salonFreebusy = await getSalonFreebusy(
    googleAuth,
    start,
    end,
    getProperty(salon.properties, 'general', 'timezone', 'UTC'),
    calendarIds
  );
  
  // debug('fetch salon users')
  
  // const salonUsers = await getSalonUsers(client, salonId)
  
  // debug('find needed user')
  
  // const master = findNeededUser(salonUsers, masterId);
  
  return salonServices
}
