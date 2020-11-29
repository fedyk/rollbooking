// import { ObjectID } from "mongodb";
// import { formatDateTime } from "../helpers/format-date-time";
// import { formatServicePrice } from "../helpers/format-service-price";
// import { renderView } from "../render";
// import { Middleware } from "../types";

// export const reservation: Middleware = async (ctx) => {
//   if (!ctx.session.userId) {
//     return ctx.throw(400, "Not authorized")
//   }

//   const userId = new ObjectID(ctx.session.userId)
//   const reservationId = new ObjectID(ctx.params.reservationId)
//   const reservation = await ctx.reservations.findOne({
//     _id: reservationId,
//     customerId: userId
//   })

//   if (!reservation) {
//     return ctx.throw(404, "Not found")
//   }

//   const organization = await ctx.organizations.findOne({
//     _id: reservation.organizationId
//   })

//   if (!organization) {
//     return ctx.throw(500, "Broken reservation")
//   }

//   const service = organization.services.find(s => s.id.equals(reservation.serviceId))

//   if (!service) {
//     return ctx.throw(500, "Missed service")
//   }

//   const assignee = organization.members.find(m => m.id.equals(reservation.assigneeId))

//   if (!assignee) {
//     return ctx.throw(500, "Missed assignee")
//   }

//   console.log(reservation, assignee)

//   ctx.state.title = `${service.name}`
//   ctx.body = await renderView("reservation.ejs", {
//     serviceName: service.name,
//     servicePrice: formatServicePrice(service),
//     date: formatDateTime(reservation.start),
//     assignee: assignee,
//     organization: organization
//   })
// }
