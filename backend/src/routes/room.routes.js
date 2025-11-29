import express from "express";
import {
  getRooms,
  getRoom,
  createRoom,
  updateRoom,
  deleteRoom,
  getAllRoomsAdmin,
} from "../controllers/room.controller.js";
import { protect, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public routes
router.get("/", getRooms);
router.get("/:id", getRoom);

// Admin routes (will be mounted at /api/admin/rooms)
export const adminRoomRoutes = express.Router();
adminRoomRoutes.use(protect, authorize("admin"));
adminRoomRoutes.get("/", getAllRoomsAdmin);
adminRoomRoutes.post("/", createRoom);
adminRoomRoutes.put("/:id", updateRoom);
adminRoomRoutes.delete("/:id", deleteRoom);

export default router;
