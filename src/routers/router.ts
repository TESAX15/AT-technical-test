import express from 'express';
import { authenticationRouter } from './authentication.router';
import { userRouter } from './user.router';
import { productRouter } from './product.router';

export const router = express.Router();

//Router to be used by the main router

router.use('/authentication', authenticationRouter);
router.use('/user', userRouter);
router.use('/product', productRouter);
