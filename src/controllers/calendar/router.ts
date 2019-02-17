import * as Router from 'koa-router'
import { calendar } from './calendar';
import { list } from './events/list';
import { create } from './events/create';
import { update } from './events/update';
import { deleteEvent } from './events/delete-event';
import { quickCreate } from './clients/quick-create';
import { suggest } from './clients/suggest';

export const router = new Router<any, any>();

router.get('/', calendar);
router.post('/events/list', list);
router.post('/events/create', create);
router.post('/events/update', update);
router.post('/events/delete', deleteEvent);
router.post('/clients/quick-create', quickCreate);
router.post('/clients/suggest', suggest);
