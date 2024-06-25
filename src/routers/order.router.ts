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
orderRouter.get('/by-current-user', orderController.getCurrentUserOrders);
orderRouter.get('/by-id:id', orderController.getOrderById);
orderRouter.get(
  '/by-user-id:id',
  authorizedUserMiddleware.isAuthorizedAdminUser,
  orderController.getOrdersByUserId
);
orderRouter.post('/create', orderController.createOrder);
orderRouter.patch('/cancel:id', orderController.cancelOrder);
orderRouter.delete(
  '/delete:id',
  authorizedUserMiddleware.isAuthorizedAdminUser,
  orderController.deleteOrderById
);
