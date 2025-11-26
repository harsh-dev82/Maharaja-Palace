import express from 'express';
import {
  createBanquetHall,
  getAllBanquetHalls,
  createBanquetBooking,
  getMyBanquetBookings,
  getBanquetHallById,
  getAllBanquetBookings,
} from '../controllers/banquetController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Admin routes
router.post('/halls', protect, authorize('admin'), createBanquetHall);

// Guest routes
router.get('/halls', getAllBanquetHalls);
router.get('/halls/:id', getBanquetHallById);
router.post('/bookings', protect, createBanquetBooking);
router.get('/bookings', protect, authorize('admin', 'manager'), getAllBanquetBookings); // Added this route
router.get('/bookings/me', protect, getMyBanquetBookings);

export default router;
