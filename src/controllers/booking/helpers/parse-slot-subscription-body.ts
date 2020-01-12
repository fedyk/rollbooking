import { ObjectID } from "bson";
import { isoDateToDateObject } from "../../../helpers/date/iso-date-to-date-object";
import { Date } from "../../../core/types/date";

export function parseSlotSubscriptionBody(body: any) {
  let userId = body ? body.userId : "";
  let serviceId = body ? body.serviceId : "";
  let date = body ? body.date : "";
  let action = body ? body.action : "";

  userId = ObjectID.isValid(userId) ? new ObjectID(userId) : null;

  serviceId = parseInt(serviceId);

  if (Number.isNaN(serviceId)) {
    serviceId = null;
  }

  if (date) {
    date = isoDateToDateObject(date);
  }
  else {
    date = null
  }

  action = action + "";

  return {
    userId: userId as ObjectID | null,
    serviceId: serviceId as number | null,
    date: date as Date | null,
    action: action as string | null,
  };
}
