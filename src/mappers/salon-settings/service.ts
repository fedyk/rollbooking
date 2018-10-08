import { SalonService } from "../../models/salon-service";

export function serviceBodyMapper(body: any, salonId: number): SalonService {
  if (!body) {
    throw new Error("Invalid payload");
  }

  const name = typeof body.name === "string" ? body.name.trim() : '';
  const duration = parseInt(body.duration || '', 10);
  const price = parseFloat(body.price || '');

  if (!name || name.length > 512) {
    throw new Error("Name is required");
  }

  // duration is passed as minutes, from 15min to 240min
  if (isNaN(duration) || duration < 15 || duration > 240) {
    throw new Error("Invalid duration");
  }

  // price should have a common seance
  if (isNaN(price) || price > 100000) {
    throw new Error("Invalid price");
  }

  return {
    id: null,
    salon_id: salonId,
    properties: {
      general: {
        name,
        description: null,
        duration: duration
      },
      price: {
        value: price
      }
    },
    created: new Date,
    updated: new Date

  }
}