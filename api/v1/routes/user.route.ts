import {Router} from 'express';
const routes = Router();
import * as controller from '../controllers/users.controller';

import * as authMiddleware from '../../../middlewares/auth.middleware';

routes.post('/register',controller.register);
routes.post('/login',controller.login);
routes.post('/password/forgot', controller.forgotPassword);
routes.post('/password/otp', controller.otpPassword);
routes.post('/password/reset', controller.resetPassword);
routes.get('/detail',authMiddleware.requireAuth, controller.detail);
routes.get('/list',authMiddleware.requireAuth, controller.list);

export const userRoutes:Router = routes;