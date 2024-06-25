import express from 'express';
import { authenticationRouter } from './authentication.router';
import { userRouter } from './user.router';
import { productRouter } from './product.router';
import { orderRouter } from './order.router';

export const router = express.Router();

//Routers to be used by the main router

router.use('/authentication', authenticationRouter);
router.use('/user', userRouter);
router.use('/product', productRouter);
router.use('/order', orderRouter);
