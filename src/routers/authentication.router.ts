import express from 'express';
import { authenticationController } from '../controllers/authentication.controller';

export const authenticationRouter = express.Router();

authenticationRouter.post('/sign-up', authenticationController.signUp);
