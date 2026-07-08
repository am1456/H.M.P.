import { Router } from "express";
import { 
    getUniversalComplainStats,
    getDailyComplaintStats,
    getCategoryComplaintStats
} from "../controllers/complaint.controller.js";
import { verifyJWT } from "../middlewares/authentication.middleware.js";

const complaintRouter = Router();

complaintRouter.route("/stats").get(getUniversalComplainStats);
complaintRouter.route("/warden-stats").get(verifyJWT, getUniversalComplainStats);
complaintRouter.route("/daily-stats").get(verifyJWT, getDailyComplaintStats);
complaintRouter.route("/category-stats").get(verifyJWT, getCategoryComplaintStats);

export default complaintRouter;