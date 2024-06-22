import express from 'express';
import { userController } from '../controllers/user.controller';

export const userRouter = express.Router();

userRouter.get('/all', userController.getAllUsers);
