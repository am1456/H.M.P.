import { Router } from "express";
import { 
    logoutUser, 
    changeCurrentPassword 
} from "../controllers/user.controller.js";
import {
    createStaff,
    getWardenComplainList,
    getStudentListForWarden,
    getStudentDetail,
    createNotice,
    deleteNotice
} from "../controllers/warden.controller.js";
import { getAllNotices } from "../controllers/notice.controller.js";
import { verifyJWT } from "../middlewares/authentication.middleware.js";
import { requireWarden } from "../middlewares/authorize.middleware.js";

const wardenRouter = Router();

wardenRouter.route("/logout").post(verifyJWT, logoutUser);
wardenRouter.route("/change-password").post(verifyJWT, changeCurrentPassword);
wardenRouter.route("/create-staff").post(verifyJWT, requireWarden, createStaff);
wardenRouter.route("/complaints").get(verifyJWT, requireWarden, getWardenComplainList);
wardenRouter.route("/students").get(verifyJWT, requireWarden, getStudentListForWarden);
wardenRouter.route("/student/:studentId").get(verifyJWT, requireWarden, getStudentDetail);
wardenRouter.route("/notice/createNotice").post(verifyJWT, requireWarden, createNotice);
wardenRouter.route("/notice/viewNotices").get(verifyJWT, getAllNotices);
wardenRouter.route("/notice/deleteNotice/:noticeId").delete(verifyJWT, requireWarden, deleteNotice);

export default wardenRouter;