import { ObjectID } from "bson";
import { CheckoutURLParams } from "../interfaces";

export function parseCheckoutRequestQuery(query?: Partial<CheckoutURLParams>): { slotId?: ObjectID; } {
  const slotId = query && query.sid && ObjectID.isValid(query.sid) ? new ObjectID(query.sid) : null;

  return {
    slotId,
  };
}
