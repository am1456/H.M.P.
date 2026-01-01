import { Router } from "express";
import { createHostelBatch, getAllHostels, getHostelCount  } from "../controllers/hostel.controller.js";
import { verifyJWT } from "../middlewares/authentication.middleware.js";
import { requireAdmin } from "../middlewares/authorize.middleware.js";

const hostelRouter = Router();

hostelRouter.route("/hostel-count").get(getHostelCount);
hostelRouter.route("/add-hostel").post(verifyJWT, requireAdmin, createHostelBatch);
hostelRouter.route("/get-all-hostels").get(verifyJWT, getAllHostels);

export default hostelRouter;