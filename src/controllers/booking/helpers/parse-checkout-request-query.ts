import { CheckoutURLParams } from "../interfaces";
import { Date as DateObject } from "../../../models/date";
import { DateTime } from "../../../models/date-time";
import { TimeOfDay } from "../../../models/time-of-day";
import { ObjectID } from "bson";
import { isoDateTimeToDateTime } from "../../../helpers/date/iso-date-time-to-date-time";
import { isoTimeToTimeOfDay } from "../../../helpers/date/iso-time-to-time-of-day";
import { isoDateToDateObject } from "../../../helpers/date/iso-date-to-date-object";

export function parseCheckoutRequestQuery(query: Partial<CheckoutURLParams>): {
  masterId: string;
  serviceId: number;
  startPeriod: DateTime;
  endPeriod: DateTime;
  time: TimeOfDay;
  date: DateObject
} {
  const masterId = query && query.mid && ObjectID.isValid(query.mid) && query.mid || null;
  const serviceId = query && query.sid && parseInt(query.sid) || null;
  const startPeriod = query && query.wdps && isoDateTimeToDateTime(query.wdps) || null;
  const endPeriod = query && query.wdpe && isoDateTimeToDateTime(query.wdpe) || null;
  const time = query && query.t && isoTimeToTimeOfDay(query.t) || null;
  const date = query && query.d && isoDateToDateObject(query.d) || null;

  return {
    masterId,
    serviceId,
    startPeriod,
    endPeriod,
    time,
    date
  };
}
