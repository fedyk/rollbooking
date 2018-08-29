import * as assert from "assert";
import debugFactory from "debug"
import { removeUserFromSalon } from '../queries/salons'
import { PoolClient } from "pg";

const debug = debugFactory('sagas:remove-salon-user');

/**
 * @param {PoolClient} client
 * @param {number} salonId
 * @param {number} userId
 * @return {void}
 */
export async function removeSalonUser(client: PoolClient, salonId: number, userId: number) {
 
  assert.ok(salonId, 'Invalid salonId')
  assert.ok(userId, 'Invalid userId')

  debug('remove user relations with salon')

  await removeUserFromSalon(client, userId, salonId)

  // TODO: handle Google Calendar
}
