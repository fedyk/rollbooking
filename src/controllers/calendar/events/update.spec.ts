import { update } from "./update";
import { Context } from "koa";
import { Salon } from "../../../models/salon";
import { ObjectID } from "bson";
import { SalonsCollection, ReservationsCollection } from "../../../adapters/mongodb";

describe("calendar / update", async function() {
  // const salon: Salon = {
  //   _id: new ObjectID("5c3819d9fb84ad76aa3be1dd"),
  //   alias: "test",
  //   name: "Test",
  //   timezone: "",
  //   employees: {
  //     users: [{
  //       id: new ObjectID("5c3818d9fb84ad76aa3be1cc"),
  //       position: "barber",
  //     }]
  //   },
  //   services: {
  //     lastServiceId: 1,
  //     items: [{
  //       id: 1,
  //       name: "Service",
  //       description: "test",
  //       duration: 60,
  //       currencyCode: "USD",
  //       price: 12
  //     }]
  //   },
  //   regularHours: {
  //     periods: [{
        
  //     }]
  //   };
  //   specialHours: SpecialHours;
  // }

  const testSalonId = new ObjectID("5c3819d9fb84ad76aa3be1d6");
  const $salons = await SalonsCollection()
  const testSalon = await $salons.findOne({ _id: testSalonId })
  const $reservations = await ReservationsCollection();
  const testReservation = await $reservations.findOne({
    salonId: testSalonId
  });

  it("should update start date", async function() {
    const output = await update({
      state: {
        salon: testSalon
      },
      body: {
        id: testReservation._id.toHexString(),
        start:
      }
    } as Context)
  })
})