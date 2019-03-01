import * as Router from 'koa-router'
import { salons } from './salons';
import { templateMiddleware } from '../../middlewares/template-middleware';
import { contentMiddleware } from '../../middlewares/content-middleware';

export const router = new Router<any, any>();

router.get('/', templateMiddleware, contentMiddleware, salons);
