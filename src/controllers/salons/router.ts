import * as Router from 'koa-router'
import { salons } from './salons';
import { templateMiddleware } from '../../middleware/template-middleware';

export const router = new Router<any, any>();

router.get('/', templateMiddleware, salons);
