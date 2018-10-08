import * as Router from 'koa-router'
import { services } from './services';
import { createService } from './create-service';
import { updateServices } from './update-services';
import { deleteService } from './delete-service';
import { newService } from './new-service';

export const router = new Router();

router.get('/services', services);
router.get('/services/new', newService);
router.post('/create-service', createService);
router.post('/update-service', updateServices);
router.post('/delete-service', deleteService);
