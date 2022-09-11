import express from "express";
import {SignIn, SignUp} from "../controllers/userController.js"

const router = express.Router();

router.post("/sign-up", SignUp);

router.post("/sign-in", SignIn);

export default router;