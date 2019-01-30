import * as Router from 'koa-router'
import { calendar } from './calendar';
import { create } from './events/create';

export const router = new Router<any, any>();

router.get('/', calendar);
router.post('/events/create', create);
