import * as Router from 'koa-router'
import { calendar } from './calendar';

export const router = new Router();

router.get('/', calendar);
