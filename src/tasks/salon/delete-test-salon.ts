import { ok } from "assert";
import { ObjectID } from "bson";
import { UsersCollection, SalonsCollection, ReservationsCollection, BookingWorkdaysCollection, closeClient } from "../../adapters/mongodb";

export async function deleteTestSalon(salonId: string) {
  ok(ObjectID.isValid(salonId), "salonId argument is not valid ObjectID");

  const $users = await UsersCollection();
  const $salons = await SalonsCollection();
  const $reservations = await ReservationsCollection();
  const $bookingWorkdays = await BookingWorkdaysCollection();
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

  $reservations.deleteMany({
    salonId: salon._id
  });

  $bookingWorkdays.deleteMany({
    salonId: salon._id
  });

  const { deletedCount: deletedSalonsCount } = await $salons.deleteOne({
    _id: salon._id
  });

  ok(deletedSalonsCount === 1, "Only one salon should be deleted, something want wrong");
}

if (!module.parent) {
  deleteTestSalon(process.argv[2])
    .then(() => console.log("Test salon was successfully deleted"))
    .catch(error => console.error(error))
    .then(() => closeClient())
}
