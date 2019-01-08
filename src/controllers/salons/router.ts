import * as Router from 'koa-router'
import { salons } from './salons';

export const router = new Router();

router.get('/', salons);
