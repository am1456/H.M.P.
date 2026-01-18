// import { Router } from "express";
// import {
//     logoutUser,
//     changeCurrentPassword
// } from "../controllers/user.controller.js";
// import { updateProfileDetail, getProfileStatus } from "../controllers/student.controller.js"
// import { verifyJWT } from "../middlewares/authentication.middleware.js";
// import { requireStudent } from "../middlewares/authorize.middleware.js";

// const studentRouter = Router();


// studentRouter.route("/logout").post(verifyJWT, logoutUser);
// studentRouter.route("/change-password").post(verifyJWT, changeCurrentPassword);
// studentRouter.route("/get-profile-status").post(verifyJWT, requireStudent, getProfileStatus);
// studentRouter.route("/updateProfileDetail").post(verifyJWT, requireStudent, updateProfileDetail);

// export default studentRouter;