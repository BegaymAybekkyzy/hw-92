import express from 'express';
import cors from 'cors';
import userRouter from "./routers/users";
import {registerMessageWs, messageRouter} from "./routers/messages";
import cookieParser from 'cookie-parser';
import expressWs from "express-ws";
import mongoose from "mongoose";
import config from "./config";

const app = express();
const port = 8000;
export const wsInstance = expressWs(app);
wsInstance.applyTo(messageRouter);

registerMessageWs();

app.use(cors({
  origin: 'http://localhost:8000',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use('/users', userRouter);
app.use('/messages', messageRouter);

const run = async () => {
  await mongoose.connect(config.db);

  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });

  process.on('exit', () => {
    mongoose.disconnect();
  });
};

run().catch(console.error);