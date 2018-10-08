import * as Router from 'koa-router'
import { services } from './services';

export const router = new Router();

router.get('/services', services);
router.post('/services', services);
