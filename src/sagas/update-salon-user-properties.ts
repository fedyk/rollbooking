import { PoolClient } from "pg";
import * as assert from "assert";
import debugFactory from "debug";

import { getUserById, getUserSalon, updateUser } from '../queries/users'
import { updateUserToSalon } from '../queries/salons'
import { UserProperties } from "../models/user";

const debug = debugFactory('sagas:update-salon-user-details');

export async function updateSalonUserDetails(client: PoolClient, salonId: number, userId: number, userDetails: UserProperties): Promise<UserProperties> {

  assert.ok(userId, 'Invalid user')
  assert.ok(salonId, 'Invalid salon')
  assert.ok(userDetails, 'Invalid data')
  assert.ok(userDetails.name, 'Missed user name')
  assert.ok(userDetails.role, 'Missed user role')

  debug('get user by id = %s', userId)

  let user = await getUserById(client, userId)

  assert.ok(user, `User doe's not exist`)

  debug('get user salon relations for userId=%s, salonId=%s', userId, salonId)

  let userSalon = await getUserSalon(client, userId, salonId)

  assert.ok(userSalon, 'Salon has no user in the list')

  debug('update user name in meta')

  const meta = Object.assign({}, user.meta, {
    name: userDetails.name
  })

  user = await updateUser(client, { meta }, userId)

  debug('update user role in meta')

  const data = Object.assign({}, userSalon.data, {
    role: userDetails.role
  })

  userSalon = await updateUserToSalon(client, userId, salonId, { data })

  return {
    name: user.meta.name,
    email: user.email,
    role: userSalon.data.role
  }
}
