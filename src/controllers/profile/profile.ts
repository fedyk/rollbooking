import { Context } from "koa";
import { User } from "../../models/user";
import { profileView } from "./profile-view";
import { ReservationsCollection, SalonsCollection, UsersCollection } from "../../adapters/mongodb";
import { Salon } from "../../models/salon";

export async function profile(ctx: Context) {
  const user = ctx.state.user as User;
  const $reservations = await ReservationsCollection();
  const $salons = await SalonsCollection();
  const $users = await UsersCollection();

  const reservations = await $reservations.find({
    userId: user._id
  }).toArray();

  const salonsIds = reservations.map(v => v.salonId);
  const mastersIds = reservations.map(v => v.masterId);

  const salons = await $salons.find({
    _id: {
      $in: salonsIds
    }
  }).toArray();

  const salonsMap = new Map<string, Salon>(salons.map(function(v): [string, Salon] {
    return [v._id.toHexString(), v];
  }));

  const masters = await $users.find({
    _id: {
      $in: mastersIds
    }
  }).toArray();

  const mastersMap = new Map<string, User>(masters.map(function(v): [string, User] {
    return [v._id.toHexString(), v];
  }));


  ctx.body = profileView({
    userName: user.name,
    email: user.email,
    reservations: reservations.map(v => {
      const salon = salonsMap.get(v.salonId.toHexString());
      const master = mastersMap.get(v.masterId.toHexString());
      const service = salon.services.items.find(s => s.id === v.serviceId);

      return {
        id: v._id.toHexString(),
        salonName: salon.name,
        masterName: master.name,
        serviceName: service.name,
        servicePrice: `${service.currencyCode}${service.price}`,
        start: v.start,
        end: v.end,
      }
    })
  })
}