import { ObjectID } from "bson";
import { isoDateToDateObject } from "../../../helpers/date/iso-date-to-date-object";
import { Date } from "../../../models/date";

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
    userId: userId as ObjectID,
    serviceId: serviceId as number,
    date: date as Date,
    action: action as string,
  };
}
