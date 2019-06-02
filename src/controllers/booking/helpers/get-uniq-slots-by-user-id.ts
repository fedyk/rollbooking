import { ObjectID } from "bson";
import { DateTime } from "../../../types/date-time";
import { dateTimeToISODate } from "../../../helpers/date/date-time-to-iso-date";
import { BookingSlot } from "../../../types/booking-slot";

interface Slot extends Partial<BookingSlot> {
  start: DateTime;
  userId: ObjectID;
}

export function getUniqSlotsByUserId(slots: Slot[], amountSlotsPerUser: Map<string, number>): Slot[] {
  const slotsByStartTime = new Map<string, Slot>();

  slots.forEach(slot => {
    const slotStartTime = dateTimeToISODate(slot.start);
    const slotUserId = slot.userId.toHexString();
    const slotUserSlotsAmount = amountSlotsPerUser.get(slotUserId);

    if (slotsByStartTime.has(slotStartTime)) {
      const existSlotId = slotsByStartTime.get(slotStartTime).userId.toHexString();

      if (slotUserSlotsAmount > amountSlotsPerUser.get(existSlotId)) {
        slotsByStartTime.set(slotStartTime, slot);
      }
    }
    else {
      slotsByStartTime.set(slotStartTime, slot);
    }
  })

  return Array.from(slotsByStartTime.values());
}
