import express from "express";
import {
  searchAvailableRooms,
  createBooking,
  getMyBookings,
  getBooking,
  confirmBooking,
  cancelBooking,
  getAllBookings,
  checkInGuest,
  checkOutGuest,
} from "../controllers/booking.controller.js";
import { protect, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public route - search available rooms
router.get("/available", searchAvailableRooms);

// Protected routes - user must be logged in
router.use(protect);

router.post("/", createBooking);
router.get("/me", getMyBookings);
router.get("/:id", getBooking);
router.patch("/:id/confirm", confirmBooking);
router.patch("/:id/cancel", cancelBooking);

// Admin routes
export const adminBookingRoutes = express.Router();
adminBookingRoutes.use(protect, authorize("admin"));
adminBookingRoutes.get("/", getAllBookings);
adminBookingRoutes.patch("/:id/checkin", checkInGuest);
adminBookingRoutes.patch("/:id/checkout", checkOutGuest);

export default router;
