import { Router } from "express";
import {
    logoutUser,
    changeCurrentPassword
} from "../controllers/user.controller.js";
import {
    updateProfileDetail,
    getProfileStatus,
    createComplaint,
    resolveComplaint,
    deleteComplaint,
    getStudentComplaints,
    getStudentDashboardStats,
    getCurrentStudentProfile,
    getAllStudentCount,
} from "../controllers/student.controller.js";
import { getAllNotices, markNoticeAsRead } from "../controllers/notice.controller.js";
import { verifyJWT } from "../middlewares/authentication.middleware.js";
import { requireStudent } from "../middlewares/authorize.middleware.js";

const studentRouter = Router();


studentRouter.route("/logout").post(verifyJWT, logoutUser);
studentRouter.route("/change-password").post(verifyJWT, changeCurrentPassword);
studentRouter.route("/profile-status").get(verifyJWT, requireStudent, getProfileStatus);
studentRouter.route("/update-profile").post(verifyJWT, requireStudent, updateProfileDetail);
studentRouter.route("/create-complaint").post(verifyJWT, requireStudent, createComplaint);
studentRouter.route("/my-complaints").get(verifyJWT, requireStudent, getStudentComplaints);
studentRouter.route("/resolve-complaint/:complaintId").patch(verifyJWT, requireStudent, resolveComplaint);
studentRouter.route("/delete-complaint/:complaintId").delete(verifyJWT, requireStudent, deleteComplaint);
studentRouter.route("/dashboard-stats").get(verifyJWT, requireStudent, getStudentDashboardStats);
studentRouter.route("/profile").get(verifyJWT, requireStudent, getCurrentStudentProfile);
studentRouter.route("/notice/viewNotices").get(verifyJWT, getAllNotices);
studentRouter.route("/student-count").get(getAllStudentCount);
studentRouter.route("/notice/markRead").patch(verifyJWT, requireStudent, markNoticeAsRead);


export default studentRouter;