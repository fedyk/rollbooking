import * as ejs from "ejs";
import * as querystring from "querystring";
import * as types from '../../types';
import * as accounts from '../../accounts';
import { Booking } from '../../booking';
import { dateTimeToISODate } from '../../helpers/date/date-time-to-iso-date';
import { DateTime } from '../../types';

export const getSlots: types.Middleware = async (ctx) => {
  const business = ctx.state.business as accounts.Business
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
        url: `/b/${business.id}/create/event?` + querystring.stringify({ user_id: slot.userId, service_id: serviceId, date: dateTimeToISODate(slot.start) })
      }))
    }
  })

  ctx.state.title = business.name
  ctx.body = await ejs.renderFile(`views/business/slots.ejs`, {
    business,
    services
  })
}

function formatDateTime(dateTime: DateTime): string {
  const h = dateTime.hours.toString().padStart(2, "0")
  const m = dateTime.minutes.toString().padStart(2, "0")

  return `${h}:${m}`

}
