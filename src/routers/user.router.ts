import express from 'express';
import { userController } from '../controllers/user.controller';
import { authenticatedUserMiddleware } from '../middleware/authenticated-user.middleware';
import { authorizedUserMiddleware } from '../middleware/authorized-user.middleware';

export const userRouter = express.Router();

userRouter.use(authenticatedUserMiddleware.isAuthenticatedUser);
userRouter.use(authorizedUserMiddleware.isAuthorizedAdminUser);

userRouter.get('/all', userController.getAllUsers);
userRouter.get('/by-id:id', userController.getUserById);
userRouter.post('/create', userController.createUser);
userRouter.put('/update:id', userController.updateUserById);
userRouter.patch('/block:id', userController.blockUser);
userRouter.patch('/unblock:id', userController.unblockUser);
userRouter.delete('/delete:id', userController.deleteUserById);
