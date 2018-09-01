import * as assert from "assert";
import { Context } from "koa";
import { connect } from '../../lib/database'
import { authorize } from '../../lib/googleapis'
import { renderer } from "../../lib/render"
import { EventDialog } from "../../view-models/schedule/event-dialog"
import { getSalonUsers } from "../../sagas/get-salon-users";
import { getMasterEvent } from "../../sagas/get-master-event";

const debug = require('debug')('controller:schedule:get-events');

export async function getEventDialog(ctx: Context, next: () => Promise<any>) {
  ctx.assert(ctx.params.salonId, 400, 'Missed salon id')
  ctx.assert(typeof ctx.params.salonId === 'number' && !Number.isNaN(ctx.params.salonId), 400, 'Invalid salon id')

  const salonId = ctx.params.salonId;
  const { eventId, startTime, endTime, masterId } = ctx.query;

  const client = await connect();
  const googleAuth = await authorize();
  const viewData: EventDialog = {};

  try {
    viewData.salonUsers = await getSalonUsers(client, salonId);

    if (eventId) {
      assert(masterId, "Master id is required")

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
        start: startTime ? new Date(startTime) : null,
        end: endTime ? new Date(endTime) : null,
        masterId: parseInt(masterId)
      }
    }
  }
  catch(e) {
    viewData.error = e;
  }

  client.release();

  ctx.body = await renderer('schedule/event-dialog.njk', viewData);
}
