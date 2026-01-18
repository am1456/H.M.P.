import { Router } from "express";
import {logoutUser} from "../controllers/user.controller.js"
import {
    changeCurrentPassword,
} from "../controllers/warden.controller.js";
import { verifyJWT } from "../middlewares/authentication.middleware.js";
import { requireWarden } from "../middlewares/authorize.middleware.js";

const wardenRouter = Router();

wardenRouter.route("/logout").post(verifyJWT, logoutUser);
wardenRouter.route("/change-password").post(verifyJWT, changeCurrentPassword);

export default wardenRouter;