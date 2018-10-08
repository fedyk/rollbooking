import * as Router from 'koa-router'
import { services } from './services';
import { editService } from './edit-service';
import { deleteService } from './delete-service';

export const router = new Router();

router.get('/services', services);
router.post('/services', services);
router.get('/services/:serviceId/edit', editService);
router.post('/services/:serviceId/edit', editService);
router.delete('/services/:serviceId/delete', deleteService);
