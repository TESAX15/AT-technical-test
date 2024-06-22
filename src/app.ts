import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { router } from './routers/router';

const app = express();
app.use(express.json());
app.use(cookieParser());

dotenv.config();

const port = process.env.PORT;

// Routing for the api
app.use('/api', router);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
