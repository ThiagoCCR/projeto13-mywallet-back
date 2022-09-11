import express from "express";
import {GetLogs, CreateLog, DeleteLog} from "../controllers/logsControllers.js"

const router = express.Router();

router.get("/logs", GetLogs);

router.post("/logs", CreateLog);

router.delete("/logs/:id", DeleteLog);

export default router;