import express from "express";
import {
  GetLogs,
  CreateLog,
  DeleteLog,
} from "../controllers/logsControllers.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { validateLogSchema } from "../middlewares/joiMiddlewares.js";

const router = express.Router();

router.get("/logs", authMiddleware, GetLogs);

router.post("/logs", authMiddleware, validateLogSchema, CreateLog);

router.delete("/logs/:id", authMiddleware, DeleteLog);

export default router;
