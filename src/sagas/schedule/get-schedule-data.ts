import { google } from 'googleapis'
import { calendar_v3 } from 'googleapis'
import { OAuth2Client } from 'google-auth-library'
import { PoolClient } from 'pg'
import debugFactory from 'debug'
import { getSalonById } from '../../queries/salons'
import Salon from '../../models/salon';
import { getSalonServices } from '../get-salon-services'
import { getSalonUsers } from '../get-salon-users'

const debug = debugFactory('saga:get-schedule-events')

export interface Params {
  client: PoolClient
  googleAuth: OAuth2Client
  salonId: number
  currentDate: Date
}

export interface Result {
  salon: Salon;
  salonUsers: any;
  salonServices: any;
}

export const getScheduleData = async (params: Params): Promise<Result> => {
  const { client, salonId } = params; 

  debug('fetch salon information')

  const salon = await getSalonById(client, salonId) as Salon;

  debug('fetch salon users')

  const salonUsers = await getSalonUsers(client, salonId)

  debug('fetch salon services')

  const salonServices = await getSalonServices(client, salonId)

  debug('factory calendar sdk')

  const calendar = google.calendar({
    version: 'v3',
    auth: params.googleAuth
  });

  debug('fetch users events')

  return {
    salon,
    salonUsers,
    salonServices
  }
}
