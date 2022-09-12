import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import userRouter from "./routers/userRouters.js";
import logRouter from "./routers/logsRouters.js";

const app = express();
app.use(express.json());
app.use(cors());

app.use(userRouter);

app.use(logRouter);

app.listen(5000, () => {
  console.log("Listening on Port 5000");
});
