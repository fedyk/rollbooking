import { ok } from "assert";
import { Context } from "koa";
import { connect } from '../../lib/database'
import { authorize } from '../../lib/googleapis'
import { renderer } from "../../lib/render"
import { EventDialog as EventDialogViewModel } from "../../view-models/schedule/event-dialog"
import { getSalonUsers } from "../../sagas/get-salon-users";
import { getMasterEvent } from "../../sagas/get-master-event";
import { parseDate } from "../../utils/date";

interface GetEventDialogParams {
  event_id: string;
  start_time: string;
  end_time: string;
  master_id: string;
}

export async function getEventDialog(ctx: Context): Promise<any> {
  const salonId = parseInt(ctx.params.salonId, 10);
  const params = ctx.request.query as GetEventDialogParams;
  const client = await connect();
  const googleAuth = await authorize();
  const viewData: EventDialogViewModel = {};

  try {
    const hasEventId = !!params.event_id;
    const masterId = parseInt(params.master_id, 10);
    const eventId = params.event_id;
    const startTime = parseDate(params.start_time);
    const endTime = parseDate(params.end_time);

    // Fetch salon users for dropdown
    viewData.salonUsers = await getSalonUsers(client, salonId);

    if (hasEventId) {
      ok(eventId, "Invalid param")
      ok(!Number.isNaN(masterId), "Invalid param")

      viewData.event = await getMasterEvent({
        client,
        googleAuth,
        salonId,
        eventId,
        masterId
      });
    }
    else {
      viewData.event = {
        id: null,
        name: null,
        start: startTime,
        end: endTime,
        masterId: masterId
      }
    }
  }
  catch(e) {
    viewData.error = e;
  }

  client.release();

  ctx.body = await renderer('schedule/event-dialog.njk', viewData);
}
