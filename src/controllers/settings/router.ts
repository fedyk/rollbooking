import * as Router from 'koa-router'
import { generalSettings } from './general-settings';

export const router = new Router();

router.get('/general', generalSettings);
