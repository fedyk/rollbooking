const Router = require('koa-router');
const { login } = require('./login')
const { logout } = require('./logout')

export const router = new Router();

router.get('login', login);
router.get('logout', logout);
