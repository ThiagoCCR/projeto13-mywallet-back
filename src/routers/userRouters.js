import express from "express";
import {SignIn, SignUp} from "../controllers/userController.js";
import {validateUserSchema} from "../middlewares/joiMiddlewares.js"


const router = express.Router();

router.post("/sign-up", validateUserSchema, SignUp);

router.post("/sign-in", SignIn);

export default router;
