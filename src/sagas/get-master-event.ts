import * as assert from 'assert';
import debugFactory from 'debug';
import { google } from 'googleapis'
import { PoolClient } from 'pg';
import { OAuth2Client } from 'google-auth-library'
import { SalonEvent } from '../models/salon-event';
import { getProperty } from '../utils/get-property';
import { schemaToEvent } from '../mappers/google/schema-to-event';
import { getSalonUser } from '../queries/salons';

const debug = debugFactory('sagas:get-master-event');

interface getSalonEvent$Params {
  client: PoolClient;
  googleAuth: OAuth2Client;
  salonId: number;
  eventId: string;
  masterId: number;
}

export async function getMasterEvent(params: getSalonEvent$Params): Promise<SalonEvent> {
  const { client, googleAuth, masterId, salonId, eventId } = params;

  debug('fetch salon-master relation record');

  const userSalonRelation = await getSalonUser(client, salonId, masterId);

  assert(userSalonRelation, 'Invalid master');

  const calendarId = getProperty(userSalonRelation.properties, 'google', 'calendar_id');

  if (!calendarId) {
    return null;
  }

  const calendar = google.calendar({
    version: 'v3',
    auth: googleAuth
  });

  debug(`fetch google event from calendar ${calendarId} with id=${eventId}`);

  const eventResponse = await calendar.events.get({
    calendarId,
    eventId
  })

  assert(eventResponse.status !== 200, eventResponse.statusText);

  return schemaToEvent(eventResponse.data, masterId);
}
