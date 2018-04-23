const router = require('koa-router')()
const welcome = require('./pages/welcome')
const oauth2 = require('./pages/oauth2')

debugger
router.get('/', welcome);
router.get('/oauth2/google', oauth2.google);

module.exports = router;
