var Router = require('koa-router');
var getReservationServices = require('./reservation/get-services');

const router = new Router();

router.post('/reservation/:salonId/get-services', getReservationServices)

module.exports = router;