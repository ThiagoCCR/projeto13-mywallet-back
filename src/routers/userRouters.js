import express from "express";
import {SignIn, SignUp} from "../controllers/userController.js";
import authMiddleware from "../middlewares/authMiddleware.js"


const router = express.Router();

router.post("/sign-up", authMiddleware, SignUp);

router.post("/sign-in", authMiddleware, SignIn);

export default router;
