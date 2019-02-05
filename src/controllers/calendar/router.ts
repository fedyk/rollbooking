import * as Router from 'koa-router'
import { calendar } from './calendar';
import { list } from './events/list';
import { create } from './events/create';

export const router = new Router<any, any>();

router.get('/', calendar);
router.post('/events/list', list);
router.post('/events/create', create);
