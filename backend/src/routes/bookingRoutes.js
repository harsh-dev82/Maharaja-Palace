import express from 'express';
import {
  createBooking,
  getMyBookings,
  getAllBookings,
  getBookingDetails,
  cancelBooking,
} from '../controllers/bookingController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Guest routes
router.post('/', protect, createBooking);
router.get('/me', protect, getMyBookings);
router.get('/:bookingId', protect, getBookingDetails);
router.put('/:bookingId/cancel', protect, cancelBooking);

// Admin routes
router.get('/', protect, authorize('admin'), getAllBookings);

export default router;
