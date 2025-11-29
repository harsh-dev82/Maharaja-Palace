import express from "express";
import {
  getBanquetHalls,
  getBanquetHall,
  checkHallAvailability,
  createBanquetHall,
  updateBanquetHall,
  deleteBanquetHall,
  getAllBanquetHallsAdmin,
} from "../controllers/banquet.controller.js";
import {
  createBanquetBooking,
  getMyBanquetBookings,
  getBanquetBooking,
  confirmBanquetBooking,
  cancelBanquetBooking,
  getAllBanquetBookings,
} from "../controllers/banquetBooking.controller.js";
import { protect, authorize } from "../middleware/auth.middleware.js";

// Banquet Halls Routes
export const banquetHallRoutes = express.Router();

// Public routes
banquetHallRoutes.get("/", getBanquetHalls);
banquetHallRoutes.get("/available", checkHallAvailability);
banquetHallRoutes.get("/:id", getBanquetHall);

// Admin routes for halls
export const adminBanquetHallRoutes = express.Router();
adminBanquetHallRoutes.use(protect, authorize("admin"));
adminBanquetHallRoutes.get("/", getAllBanquetHallsAdmin);
adminBanquetHallRoutes.post("/", createBanquetHall);
adminBanquetHallRoutes.put("/:id", updateBanquetHall);
adminBanquetHallRoutes.delete("/:id", deleteBanquetHall);

// Banquet Bookings Routes
export const banquetBookingRoutes = express.Router();

// Protected routes - user must be logged in
banquetBookingRoutes.use(protect);
banquetBookingRoutes.post("/", createBanquetBooking);
banquetBookingRoutes.get("/me", getMyBanquetBookings);
banquetBookingRoutes.get("/:id", getBanquetBooking);
banquetBookingRoutes.patch("/:id/confirm", confirmBanquetBooking);
banquetBookingRoutes.patch("/:id/cancel", cancelBanquetBooking);

// Admin routes for bookings
export const adminBanquetBookingRoutes = express.Router();
adminBanquetBookingRoutes.use(protect, authorize("admin"));
adminBanquetBookingRoutes.get("/", getAllBanquetBookings);
