import express from 'express';
import {
  createRoomType,
  getAllRoomTypes,
  createRoom,
  getAllRooms,
  getAvailableRooms,
  updateRoomStatus,
  getRoomById,
} from '../controllers/roomController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Admin routes
router.post('/room-types', protect, authorize('admin'), createRoomType);
router.get('/room-types', getAllRoomTypes);

router.post('/rooms', protect, authorize('admin'), createRoom);
router.get('/rooms', protect, authorize('admin'), getAllRooms);
router.put('/rooms/:roomId/status', protect, authorize('admin'), updateRoomStatus);

// Guest routes
router.get('/available', getAvailableRooms);
router.get('/:id', getRoomById);

export default router;
