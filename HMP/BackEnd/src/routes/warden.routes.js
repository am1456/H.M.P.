import { Router } from "express";
import {
    logoutUser,
    changeCurrentPassword,
    getStudentsForWarden,
    getUserById
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/authentication.middleware.js";
import { requireWarden } from "../middlewares/authorize.middleware.js";

const wardenRouter = Router();

wardenRouter.route("/logout").post(verifyJWT, logoutUser);
wardenRouter.route("/change-password").post(verifyJWT, changeCurrentPassword);

wardenRouter.route("/students").get(verifyJWT, requireWarden, getStudentsForWarden);
wardenRouter.route("/students/:userId").get(verifyJWT, requireWarden, getUserById);

export default wardenRouter;