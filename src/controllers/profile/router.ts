import * as Router from 'koa-router'
import { profile } from './profile';

export const router = new Router<any, any>();

router.get('/', profile);
