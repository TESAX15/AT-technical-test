import express from 'express';
import { productController } from '../controllers/product.controller';
import { authenticatedUserMiddleware } from '../middleware/authenticated-user.middleware';
import { authorizedUserMiddleware } from '../middleware/authorized-user.middleware';

export const productRouter = express.Router();

productRouter.use(authenticatedUserMiddleware.isAuthenticatedUser);

productRouter.get('/all', productController.getAllProducts);
productRouter.get('/available', productController.getAvailableProducts);
productRouter.get('/by-id:id', productController.getProductById);
productRouter.post(
  '/create',
  authorizedUserMiddleware.isAuthorizedAdminUser,
  productController.createProduct
);
productRouter.put(
  '/update:id',
  authorizedUserMiddleware.isAuthorizedAdminUser,
  productController.updateProductById
);
productRouter.delete(
  '/delete:id',
  authorizedUserMiddleware.isAuthorizedAdminUser,
  productController.deleteProductById
);
