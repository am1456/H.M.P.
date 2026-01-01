import { Router } from "express";
import {
    logoutUser,
    createAdmin,
    createWarden,
    createStudent,
    changeCurrentPassword,
    createSuperAdmin,
    getAllUsersForAdmin,
    getUserById,
    updateUserByAdmin,
    deleteUser
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/authentication.middleware.js";
import { requireAdmin, requireSuperAdmin } from "../middlewares/authorize.middleware.js";

const adminRouter = Router();

adminRouter.route("/create-super-admin").post(createSuperAdmin);

adminRouter.route("/logout").post(verifyJWT, logoutUser);
adminRouter.route("/change-password").post(verifyJWT, changeCurrentPassword);

adminRouter.route("/create-admin").post(verifyJWT, requireSuperAdmin, createAdmin);
adminRouter.route("/create-warden").post(verifyJWT, requireAdmin, createWarden);
adminRouter.route("/create-student").post(verifyJWT, requireAdmin, createStudent);
adminRouter.route("/users").get(verifyJWT, requireAdmin, getAllUsersForAdmin);
adminRouter.route("/users/:userId").get(verifyJWT, requireAdmin, getUserById);
adminRouter.route("/users/:userId").patch(verifyJWT, requireAdmin, updateUserByAdmin);
adminRouter.route("/delete-user/:userId").delete(verifyJWT, requireAdmin,deleteUser)

export default adminRouter;