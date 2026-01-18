import { loginUser, forgotPassword, refreshAccessToken } from "../controllers/user.controller.js";
import { Router } from "express";

const userRouter = Router();

userRouter.post("/login", loginUser);
userRouter.post("/forgot-password", forgotPassword);
userRouter.route("/refresh-token").post(refreshAccessToken);

export default userRouter;