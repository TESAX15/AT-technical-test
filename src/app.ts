import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

const app = express();
app.use(express.json());
app.use(cookieParser());

dotenv.config();

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
