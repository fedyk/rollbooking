import * as tz from "timezone-support";
import * as ejs from "ejs";
import * as querystring from "querystring";
import * as Types from '../types';
import * as accounts from '../accounts';
import { Booking, Slot } from '../booking';
import { dateTimeToISODate } from '../helpers/date/date-time-to-iso-date';
import { DateTime } from '../types';

export const getBusinessProfile: Types.Middleware = async (ctx) => {
  const business = ctx.state.business as accounts.Business

  if (!business) {
    return ctx.throw(404, new Error("Page does not exist"))
  }

  ctx.state.title = business.name

  const booking = new Booking(business, [])
  const servicesSlots = booking.getServicesSlots()
  const servicesById = new Map(business.services.map(s => [s.id, s]))
  const services = servicesSlots.map(servicesSlots => {
    const [serviceId, slots] = servicesSlots
    const service = servicesById.get(serviceId)

    if (!service) {
      return null
    }

    return {
      name: service.name,
      price: service.price + service.currencyCode,
      slots: slots.map(slot => ({
        title: dateTimeToISODate(slot.start),
        text: formatDateTime(slot.start),
        url: `/p/${business.id}/booking?` + querystring.stringify({ user_id: slot.userId, service_id: serviceId, date: dateTimeToISODate(slot.start) })
      }))
    }
  })

  ctx.body = await ejs.renderFile(`views/account-profile/slots.ejs`, {
    business,
    services
  })
}

const months = [
  // const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  // const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
]

function formatDateTime(dateTime: DateTime): string {
  const h= dateTime.hours.toString().padStart(2, "0")
  const m= dateTime.minutes.toString().padStart(2, "0")

  return `${h}:${m}`

}

function combine(slots: Slot[], services: accounts.BusinessService[]) {
  return services.map(function (service) {
    const serviceSlots = slots.filter(s => s.serviceId === service.id)
    const uniqSlots = new Map<number, Slot>(serviceSlots.map(function(slot) {
      return [tz.getUnixTime(slot.start), slot]
    }))

    return Array.from(uniqSlots.values())
  })
}