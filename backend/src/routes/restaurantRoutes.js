import express from 'express';
import {
  createRestaurantTable,
  getAllRestaurantTables,
  createRestaurantBooking,
  getMyRestaurantBookings,
  getRestaurantTableById,
  getAllRestaurantBookings,
} from '../controllers/restaurantController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Admin routes
router.post('/tables', protect, authorize('admin'), createRestaurantTable);

// Guest routes
router.get('/tables', getAllRestaurantTables);
router.get('/tables/:id', getRestaurantTableById);
router.post('/bookings', protect, createRestaurantBooking);
router.get('/bookings', protect, authorize('admin', 'manager'), getAllRestaurantBookings); // Added this line
router.get('/bookings/me', protect, getMyRestaurantBookings);

export default router;
