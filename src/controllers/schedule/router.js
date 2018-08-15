const Router = require('koa-router');
const schedule = require('./index')
// const getReservationServices = require('./reservation/get-services');
const router = new Router();

router.get(':salonId', schedule);
// router.post('reservation/:salonId/get-services', getReservationServices);

module.exports = router;
