import { PoolClient } from "pg";
import * as assert from "assert";
import debugFactory from "debug";
import * as deepMerge from "deepmerge";
import { updateSalonUser, getSalonUser } from '../queries/salons'
import { SalonUserProperties, SalonUser } from "../models/salon-user";

const debug = debugFactory('sagas:update-salon-user-details');

export async function updateSalonUserProperties(
  client: PoolClient,
  userId: number,
  salonId: number,
  userProperties: SalonUserProperties
): Promise<SalonUser> {

  assert.ok(userId, 'Missed user id')
  assert.ok(salonId, 'Missed salon id')
  assert.ok(userProperties, 'Missed user properties to update')

  debug('get user salon relations for userId=%s, salonId=%s', userId, salonId)

  const salonUser = await getSalonUser(client, userId, salonId);

  assert.ok(salonUser, 'Salon and user has no relations')

  debug('update user name in meta')

  const properties = deepMerge(salonUser.properties, userProperties)

  return await updateSalonUser(client, salonId, userId, { ...salonUser, properties });
}
