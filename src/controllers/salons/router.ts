import * as Router from 'koa-router'
import { salons } from './salons';

export const router = new Router<any, any>();

router.get('/', salons);
