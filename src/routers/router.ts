import express from 'express';
import { authenticationRouter } from './authentication.router';

export const router = express.Router();

//Router to be used by the main router

router.use('/authentication', authenticationRouter);
