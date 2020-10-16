import { Router } from 'express';
import ApiController from '../controllers/api';

const ApiRouter = Router();

ApiRouter.get('/:url', ApiController.get);

ApiRouter.post('/set', ApiController.save);

export default ApiRouter;