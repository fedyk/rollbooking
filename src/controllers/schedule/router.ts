import * as Router from 'koa-router'
import { schedule } from './index'
import { getEvents } from './get-events'
import { getEventDialog } from './get-event-dialog'
import { createEvent } from './create-event';
import { inviteUser } from './invite-user';

export const router = new Router();

router.get(':salonId', schedule);
router.get(':salonId/get-events', getEvents);
router.post(':salonId/create-event', createEvent);
router.post(':salonId/get-event-dialog', getEventDialog);
router.post(':salonId/invite-user', inviteUser);
