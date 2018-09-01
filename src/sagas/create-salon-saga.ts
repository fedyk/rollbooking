import * as assert from "assert";
import * as deepMerge from "deepmerge";
import { google } from 'googleapis'
import { authorize } from '../lib/googleapis'
import debugFactory from "debug";
import { updateUser } from '../queries/users'
import { createSalon, addSalonUser } from '../queries/salons'
import Salon, { SalonProperties } from '../models/salon';
import { PoolClient } from 'pg';
import { User } from '../models/user';
import { getProperty } from "../utils/get-property";
import { SalonUser, SalonUserRole } from "../models/salon-user";

const debug = debugFactory('sagas:create-salon-saga')

export async function createSalonSaga(client: PoolClient, salon: Salon, owner: User): Promise<Salon> {
  assert(salon, "Salon is required")
  assert(salon.name, "Salon name is required")
  assert(owner, "Owner is required");

  debug('create salon %s', salon.name)

  salon = await createSalon(client, Object.assign({}, salon, {
    created: new Date(),
    updated: new Date(),
  }));

  const auth = await authorize()

  const calendar = google.calendar({
    version: 'v3',
    auth
  });

  debug('create calendar for salon owner')

  const calendarResource = {
    summary: `Calendar ${salon.id}:${owner.id}`,
    timeZone: getProperty(salon.properties, 'general', 'timezone')
  }

  const { data: createdCalendar } = await calendar.calendars.insert({
    requestBody: calendarResource,
    auth
  })

  debug('create salon worker')

  const salonUser: SalonUser = {
    user_id: owner.id,
    salon_id: salon.id,
    properties: {
      general: {
        role: SalonUserRole.Owner,
        timezone: getProperty(salon.properties, 'general', 'timezone')
      },
      google: {
        calendar_id: createdCalendar.id,
        calendar_etag: createdCalendar.etag,
        calendar_kind: createdCalendar.kind,
      }
    },
    created: new Date(),
    updated: new Date(),
  }

  await addSalonUser(client, salonUser)

  debug('update user timezone if it is empty')

  if (!getProperty(owner.properties, 'general', 'timezone')) {
    const properties: Partial<SalonProperties> = {
      general: {
        timezone: getProperty(salon.properties, 'general', 'timezone')
      }
    }

    const updatedUser = deepMerge(owner, properties)

    await updateUser(client, owner.id, updatedUser)
  }

  return salon;
}
