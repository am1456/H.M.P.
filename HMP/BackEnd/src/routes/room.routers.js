import { Router } from "express";
import { addRoomsBatch, getRoomsByHostel, getLastRoom } from "../controllers/room.controller.js";
import { verifyJWT } from "../middlewares/authentication.middleware.js";
import { requireAdmin } from "../middlewares/authorize.middleware.js";

const roomRouter = Router();

roomRouter.route("/add-room").post(verifyJWT, requireAdmin, addRoomsBatch);
roomRouter.route("/get-rooms/:hostelId").get(verifyJWT, getRoomsByHostel);
roomRouter.route("/last-room/:hostelId").get(verifyJWT, getLastRoom);

export default roomRouter;