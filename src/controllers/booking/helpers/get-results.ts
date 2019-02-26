import { stringify } from "querystring";
import { SalonService } from "../../../models/salon";
import { CheckoutURLParams } from "../interfaces";
import { BookingSlot } from "../../../models/booking-slot";
import { getUniqSlotsByUserId } from "./get-uniq-slots-by-user-id";

interface Params {
  salonAlias: string;
  bookingSlots: BookingSlot[];
  services: SalonService[];
}

interface Result {
  name: string;
  price: string;
  description?: string;
  times: Array<{
    url: string;
    text: string;
  }>
}

export function getResults({ salonAlias, bookingSlots, services }: Params): Result[] {
  const slotsByServiceId = new Map<number, Array<BookingSlot>>();
  const amountSlotsPerUser = new Map<string, number>();

  bookingSlots.forEach(v => {
    if (slotsByServiceId.has(v.serviceId)) {
      slotsByServiceId.get(v.serviceId).push(v);
    }
    else {
      slotsByServiceId.set(v.serviceId, [v])
    }

    const userId = v.userId.toHexString();

    if (amountSlotsPerUser.has(userId)) {
      amountSlotsPerUser.set(userId, amountSlotsPerUser.get(userId) + 1);
    }
    else {
      amountSlotsPerUser.set(userId, 1);
    }
  });

  return services.filter(v => slotsByServiceId.has(v.id)).map(service => {
    const slots = slotsByServiceId.get(service.id);
    const uniqSlots = getUniqSlotsByUserId(slots, amountSlotsPerUser);

    return {
      name: service.name,
      price: prettyPrice(service.price),
      description: service.description,
      times: uniqSlots.map(slot => {
        const hours = slot.start.hours.toString().padStart(2, "0");
        const minutes = slot.start.minutes.toString().padStart(2, "0");
        const queryString: CheckoutURLParams = {
          sid: slot._id.toHexString()
        }

        return {
          text: `${hours}:${minutes}`,
          url: `/${salonAlias}/booking/checkout?${stringify(queryString)}`
        }
      })
    }
  })
}

// TODO: add currency to number
function prettyPrice(price: number) {
  return price.toString()
}
