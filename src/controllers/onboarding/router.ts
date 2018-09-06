const Router = require('koa-router');
const { onboarding } = require('./index')
const { createSalon } = require('./create-salon')

export const router = new Router();

router.get('/', onboarding);
router.post('/', createSalon);
