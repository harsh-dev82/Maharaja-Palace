import express from "express";
import {
  getRestaurantTables,
  getRestaurantTable,
  checkTableAvailability,
  createRestaurantTable,
  updateRestaurantTable,
  deleteRestaurantTable,
  getAllRestaurantTablesAdmin,
} from "../controllers/restaurant.controller.js";
import {
  createRestaurantBooking,
  getMyRestaurantBookings,
  getRestaurantBooking,
  confirmRestaurantBooking,
  cancelRestaurantBooking,
  getAllRestaurantBookings,
  seatGuest,
  completeBooking,
} from "../controllers/restaurantBooking.controller.js";
import { protect, authorize } from "../middleware/auth.middleware.js";

// Restaurant Tables Routes
export const restaurantTableRoutes = express.Router();

// Public routes
restaurantTableRoutes.get("/", getRestaurantTables);
restaurantTableRoutes.get("/available", checkTableAvailability);
restaurantTableRoutes.get("/:id", getRestaurantTable);

// Admin routes for tables
export const adminRestaurantTableRoutes = express.Router();
adminRestaurantTableRoutes.use(protect, authorize("admin"));
adminRestaurantTableRoutes.get("/", getAllRestaurantTablesAdmin);
adminRestaurantTableRoutes.post("/", createRestaurantTable);
adminRestaurantTableRoutes.put("/:id", updateRestaurantTable);
adminRestaurantTableRoutes.delete("/:id", deleteRestaurantTable);

// Restaurant Bookings Routes
export const restaurantBookingRoutes = express.Router();

// Protected routes - user must be logged in
restaurantBookingRoutes.use(protect);
restaurantBookingRoutes.post("/", createRestaurantBooking);
restaurantBookingRoutes.get("/me", getMyRestaurantBookings);
restaurantBookingRoutes.get("/:id", getRestaurantBooking);
restaurantBookingRoutes.patch("/:id/confirm", confirmRestaurantBooking);
restaurantBookingRoutes.patch("/:id/cancel", cancelRestaurantBooking);

// Admin routes for bookings
export const adminRestaurantBookingRoutes = express.Router();
adminRestaurantBookingRoutes.use(protect, authorize("admin"));
adminRestaurantBookingRoutes.get("/", getAllRestaurantBookings);
adminRestaurantBookingRoutes.patch("/:id/seat", seatGuest);
adminRestaurantBookingRoutes.patch("/:id/complete", completeBooking);
