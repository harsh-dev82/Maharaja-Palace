import Booking from "../models/Booking.js";
import Room from "../models/Room.js";
import RoomType from "../models/RoomType.js";

/**
 * Check room availability for given dates
 */
export const getAvailableRooms = async (
  checkInDate,
  checkOutDate,
  guestsCount = 1,
  roomTypeId = null
) => {
  try {
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    // Validate dates
    if (checkIn >= checkOut) {
      throw new Error("Check-out date must be after check-in date");
    }

    if (checkIn < new Date().setHours(0, 0, 0, 0)) {
      throw new Error("Check-in date cannot be in the past");
    }

    // Find conflicting bookings
    const conflictingBookings = await Booking.find({
      status: { $in: ["pending", "confirmed", "checked-in"] },
      $or: [
        {
          checkInDate: { $lt: checkOut },
          checkOutDate: { $gt: checkIn },
        },
      ],
    }).select("room");

    const bookedRoomIds = conflictingBookings.map((booking) => booking.room);

    // Build room query
    let roomQuery = {
      _id: { $nin: bookedRoomIds },
      status: "available",
      isActive: true,
    };

    // Add room type filter if specified
    if (roomTypeId) {
      roomQuery.roomType = roomTypeId;
    }

    // Get available rooms with room type details
    const availableRooms = await Room.find(roomQuery)
      .populate("roomType")
      .lean();

    // Filter by occupancy and add pricing info
    const filteredRooms = availableRooms
      .filter((room) => room.roomType.maxOccupancy >= guestsCount)
      .map((room) => ({
        ...room,
        priceForStay: calculateTotalPrice(
          room.roomType.basePrice,
          checkIn,
          checkOut
        ),
      }));

    return filteredRooms;
  } catch (error) {
    throw error;
  }
};

/**
 * Calculate total price for stay
 */
const calculateTotalPrice = (pricePerNight, checkIn, checkOut) => {
  const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
  return pricePerNight * nights;
};

/**
 * Check if specific room is available for dates
 */
export const isRoomAvailable = async (roomId, checkInDate, checkOutDate) => {
  try {
    const conflictingBooking = await Booking.findOne({
      room: roomId,
      status: { $in: ["pending", "confirmed", "checked-in"] },
      $or: [
        {
          checkInDate: { $lt: new Date(checkOutDate) },
          checkOutDate: { $gt: new Date(checkInDate) },
        },
      ],
    });

    return !conflictingBooking;
  } catch (error) {
    throw error;
  }
};

export default {
  getAvailableRooms,
  isRoomAvailable,
};
