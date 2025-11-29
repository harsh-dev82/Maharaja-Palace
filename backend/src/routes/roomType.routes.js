import express from "express";
import {
  getRoomTypes,
  getRoomType,
  createRoomType,
  updateRoomType,
  deleteRoomType,
  getAllRoomTypesAdmin,
} from "../controllers/roomType.controller.js";
import { protect, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public routes
router.get("/", getRoomTypes);
router.get("/:id", getRoomType);

// Admin routes (will be mounted at /api/admin/room-types)
export const adminRoomTypeRoutes = express.Router();
adminRoomTypeRoutes.use(protect, authorize("admin"));
adminRoomTypeRoutes.get("/", getAllRoomTypesAdmin);
adminRoomTypeRoutes.post("/", createRoomType);
adminRoomTypeRoutes.put("/:id", updateRoomType);
adminRoomTypeRoutes.delete("/:id", deleteRoomType);

export default router;
