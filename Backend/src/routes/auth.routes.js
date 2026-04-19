import {Router} from "express";
import { register, VerifyEmail , login, getMe} from "../controller/auth.controller.js";
import { registerValidator, loginValidator } from "../validators/auth.validator.js";
import {authUser} from "../middleware/auth.miidleware.js"
const authRouter = Router();


/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 * @body { username, email, password }
 */
authRouter.post("/register", registerValidator, register);
authRouter.post("/login", loginValidator, login);

authRouter.get("/getMe", authUser, getMe)


authRouter.get('/verify-email', VerifyEmail)

export default authRouter;