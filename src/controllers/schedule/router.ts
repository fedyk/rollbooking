import * as Router from 'koa-router'
import { schedule } from './index'
import { getEvents } from './get-events'
import { getEventDialog } from './get-event-dialog'

export const router = new Router();

router.get(':salonId', schedule);
router.get(':salonId/get-events', getEvents);
router.get(':salonId/get-event-dialog', getEventDialog);

