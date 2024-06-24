import express from 'express';
import { authenticatedUserMiddleware } from '../middleware/authenticated-user.middleware';
import { orderController } from '../controllers/order.controller';
import { authorizedUserMiddleware } from '../middleware/authorized-user.middleware';

export const orderRouter = express.Router();

orderRouter.use(authenticatedUserMiddleware.isAuthenticatedUser);

orderRouter.get(
  '/all',
  authorizedUserMiddleware.isAuthorizedAdminUser,
  orderController.getAllOrders
);
orderRouter.post('/create', orderController.createOrder);
