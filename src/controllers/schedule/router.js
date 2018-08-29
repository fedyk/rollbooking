const Router = require('koa-router');
const { schedule } = require('./index')
const { getEvents } = require('./get-events')
const { getEventDialog } = require('./get-event-dialog')
// const getReservationServices = require('./reservation/get-services');
const router = new Router();

router.get(':salonId', schedule);
router.get(':salonId/get-events', getEvents);
router.get(':salonId/get-event-dialog', getEventDialog);
// router.post('reservation/:salonId/get-services', getReservationServices);

module.exports = router;
