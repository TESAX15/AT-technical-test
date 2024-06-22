import express from 'express';
import { authenticationController } from '../controllers/authentication.controller';

export const authenticationRouter = express.Router();

authenticationRouter.post('/sign-up', authenticationController.signUp);
authenticationRouter.post('/login', authenticationController.logIn);
authenticationRouter.delete('/logout', authenticationController.logout);
