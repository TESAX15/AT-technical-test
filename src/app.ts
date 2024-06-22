import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { router } from './routers/router';
import { initializeEnvVariables, env } from './env-configuration/env-variables-configuration';

const app = express();
app.use(express.json());
app.use(cookieParser());

dotenv.config();

// This function will validate the env variables and set the values to a constant named env
initializeEnvVariables();

const port = env.PORT;

// Routing for the api
app.use('/api', router);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
