import Booking from "../models/Booking.js";
import Room from "../models/Room.js";
import RoomType from "../models/RoomType.js";
import { isRoomAvailable } from "./availability.service.js";

/**
 * Create a new booking with availability check
 */
export const createBooking = async (bookingData) => {
  try {
    const { roomId, checkInDate, checkOutDate, guestsCount } = bookingData;

    // Check if room exists and is active
    const room = await Room.findById(roomId).populate("roomType");
    if (!room || !room.isActive) {
      throw new Error("Room not found or inactive");
    }

    // Check availability
    const available = await isRoomAvailable(roomId, checkInDate, checkOutDate);
    if (!available) {
      throw new Error("Room is not available for the selected dates");
    }

    // Check occupancy
    if (guestsCount > room.roomType.maxOccupancy) {
      throw new Error(
        `Room maximum occupancy is ${room.roomType.maxOccupancy} guests`
      );
    }

    // Calculate price
    const nights = Math.ceil(
      (new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24)
    );
    const totalPrice = room.roomType.basePrice * nights;

    // Create booking
    const booking = await Booking.create({
      ...bookingData,
      room: roomId,
      roomType: room.roomType._id,
      pricePerNight: room.roomType.basePrice,
      numberOfNights: nights,
      totalPrice: totalPrice,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes expiry
    });

    // Populate the booking with room and roomType details
    const populatedBooking = await Booking.findById(booking._id)
      .populate("room", "roomNumber floor view")
      .populate("roomType", "name basePrice amenities");

    return populatedBooking;
  } catch (error) {
    throw error;
  }
};

/**
 * Confirm booking after payment
 */
export const confirmBooking = async (bookingId, paymentData) => {
  try {
    const { paymentId, paymentMethod } = paymentData;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      throw new Error("Booking not found");
    }

    if (booking.status !== "pending") {
      throw new Error(
        `Booking cannot be confirmed. Current status: ${booking.status}`
      );
    }

    // Update booking status
    booking.status = "confirmed";
    booking.paymentStatus = "paid";
    booking.paymentId = paymentId;
    booking.paymentMethod = paymentMethod;
    booking.expiresAt = undefined; // Remove expiry

    await booking.save();

    // Populate the updated booking
    const confirmedBooking = await Booking.findById(booking._id)
      .populate("user", "name email phone")
      .populate("room", "roomNumber floor view")
      .populate("roomType", "name basePrice amenities");

    return confirmedBooking;
  } catch (error) {
    throw error;
  }
};

/**
 * Cancel booking
 */
export const cancelBooking = async (
  bookingId,
  cancelledBy,
  reason = "User cancelled"
) => {
  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      throw new Error("Booking not found");
    }

    // Check if booking can be cancelled
    if (!["pending", "confirmed"].includes(booking.status)) {
      throw new Error(
        `Booking cannot be cancelled. Current status: ${booking.status}`
      );
    }

    // Update booking
    booking.status = "cancelled";
    booking.paymentStatus =
      booking.paymentStatus === "paid" ? "refunded" : "failed";
    booking.cancellationReason = reason;
    booking.cancelledAt = new Date();
    booking.cancelledBy = cancelledBy;

    await booking.save();

    return booking;
  } catch (error) {
    throw error;
  }
};

/**
 * Check-in guest
 */
export const checkIn = async (bookingId) => {
  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      throw new Error("Booking not found");
    }

    if (booking.status !== "confirmed") {
      throw new Error(
        `Booking cannot be checked in. Current status: ${booking.status}`
      );
    }

    booking.status = "checked-in";
    booking.actualCheckInDate = new Date();

    await booking.save();

    return booking;
  } catch (error) {
    throw error;
  }
};

/**
 * Check-out guest
 */
export const checkOut = async (bookingId) => {
  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      throw new Error("Booking not found");
    }

    if (booking.status !== "checked-in") {
      throw new Error(
        `Booking cannot be checked out. Current status: ${booking.status}`
      );
    }

    booking.status = "checked-out";
    booking.actualCheckOutDate = new Date();

    await booking.save();

    return booking;
  } catch (error) {
    throw error;
  }
};

export default {
  createBooking,
  confirmBooking,
  cancelBooking,
  checkIn,
  checkOut,
};
