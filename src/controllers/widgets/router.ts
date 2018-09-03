import * as Router from 'koa-router';
import { getServices } from './reservation/get-services';

export const router = new Router();

router.post('reservation/:salonId/get-services', getServices);
