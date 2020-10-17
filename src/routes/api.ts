import { Router } from 'express';
import ApiController from '../controllers/api';

const ApiRouter = Router();

ApiRouter.get('/:url', ApiController.get);

ApiRouter.post('/set', ApiController.save);

ApiRouter.get('/monitor', ApiController.getMonitorStats);

ApiRouter.post('/monitorLink', ApiController.saveMonitorLink);

ApiRouter.post('/monitorSite', ApiController.saveMonitorSite);

export default ApiRouter;