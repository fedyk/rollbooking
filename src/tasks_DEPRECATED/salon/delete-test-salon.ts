import { ok } from "assert";
import { ObjectID } from "bson";
import {
  UsersCollection_DEPRECATED,
  SalonsCollection_DEPRECATED,
  ReservationsCollection_DEPRECATED,
  BookingWorkdaysCollection_DEPRECATED,
  BookingSlotsCollection_DEPRECATED,
  ClientsCollection_DEPRECATED,
  closeClient,
} from "../../base/db/mongodb";

export async function deleteTestSalon(salonId: string) {
  ok(ObjectID.isValid(salonId), "salonId argument is not valid ObjectID");

  const $users = await UsersCollection_DEPRECATED();
  const $salons = await SalonsCollection_DEPRECATED();
  const $reservations = await ReservationsCollection_DEPRECATED();
  const $bookingWorkdays = await BookingWorkdaysCollection_DEPRECATED();
  const $bookingSlots = await BookingSlotsCollection_DEPRECATED();
  const $clients = await ClientsCollection_DEPRECATED();
  const salon = await $salons.findOne({
    _id: new ObjectID(salonId)
  });

  if (!salon) {
    throw new Error("Salon doesn't exist");
  }

  const usersIds = salon.employees.users.map(v => v.id);

  if (usersIds.length > 0) {
    const deleteResult = await $users.deleteMany({
      _id: {
        $in: usersIds
      }
    })

    ok(deleteResult.deletedCount === usersIds.length, `Deleted users count is not equal to requested users to delete(${deleteResult.deletedCount}/${usersIds.length})`);
  }

  await $reservations.deleteMany({
    salonId: salon._id
  });


  await $bookingWorkdays.deleteMany({
    salonId: salon._id
  });

  await $bookingSlots.deleteMany({
    salonId: salon._id
  })

  await $clients.deleteMany({
    salonId: salon._id
  });

  const { deletedCount: deletedSalonsCount } = await $salons.deleteOne({
    _id: salon._id
  });

  ok(deletedSalonsCount === 1, "Only one salon should be deleted, something went wrong");
}

if (!module.parent) {
  deleteTestSalon(process.argv[2])
    .then(() => console.log("Test salon was successfully deleted"))
    .catch(error => console.error(error))
    .then(() => closeClient())
}
