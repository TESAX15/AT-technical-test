import express from 'express';
import { authenticatedUserMiddleware } from '../middleware/authenticated-user.middleware';
import { orderController } from '../controllers/order.controller';

export const orderRouter = express.Router();

orderRouter.use(authenticatedUserMiddleware.isAuthenticatedUser);

orderRouter.post('/create', orderController.createOrder);
