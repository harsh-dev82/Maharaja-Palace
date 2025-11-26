import RestaurantTable from '../models/RestaurantTable.js';
import RestaurantBooking from '../models/RestaurantBooking.js';
import { logger } from '../utils/logger.js';

// Admin - Create Restaurant Table
export const createRestaurantTable = async (req, res, next) => {
  try {
    const { tableNumber, capacity, location, description, features } = req.body;

    if (!tableNumber || !capacity || !location) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    const table = await RestaurantTable.create({
      tableNumber,
      capacity,
      location,
      description,
      features,
    });

    logger.info(`Restaurant table created: ${tableNumber}`);

    res.status(201).json({
      success: true,
      message: 'Restaurant table created successfully',
      table,
    });
  } catch (error) {
    logger.error(`Create restaurant table error: ${error.message}`);
    next(error);
  }
};

// Get All Restaurant Tables
export const getAllRestaurantTables = async (req, res, next) => {
  try {
    const tables = await RestaurantTable.find({ isActive: true });

    res.status(200).json({
      success: true,
      count: tables.length,
      tables,
    });
  } catch (error) {
    logger.error(`Get restaurant tables error: ${error.message}`);
    next(error);
  }
};

// Guest - Create Restaurant Booking
export const createRestaurantBooking = async (req, res, next) => {
  try {
    const { table, bookingDate, timeSlot, numberOfGuests, specialDietaryRequirements, specialRequests } = req.body;

    if (!table || !bookingDate || !timeSlot || !numberOfGuests) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    const booking = await RestaurantBooking.create({
      guest: req.user.id,
      table,
      bookingDate,
      timeSlot,
      numberOfGuests,
      specialDietaryRequirements,
      specialRequests,
      status: 'pending',
    });

    logger.info(`Restaurant booking created: ${booking.bookingNumber}`);

    res.status(201).json({
      success: true,
      message: 'Restaurant booking created successfully',
      booking: await booking.populate(['guest', 'table']),
    });
  } catch (error) {
    logger.error(`Create restaurant booking error: ${error.message}`);
    next(error);
  }
};

// Get My Restaurant Bookings
export const getMyRestaurantBookings = async (req, res, next) => {
  try {
    const bookings = await RestaurantBooking.find({ guest: req.user.id })
      .populate('table')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    logger.error(`Get my restaurant bookings error: ${error.message}`);
    next(error);
  }
};

// Get Restaurant Table By ID
export const getRestaurantTableById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const table = await RestaurantTable.findById(id);

    if (!table) {
      return res.status(404).json({
        success: false,
        message: 'Table not found',
      });
    }

    res.status(200).json({
      success: true,
      table,
    });
  } catch (error) {
    logger.error(`Get restaurant table by id error: ${error.message}`);
    next(error);
  }
};
// Get All Restaurant Bookings (Admin)
export const getAllRestaurantBookings = async (req, res, next) => {
  try {
    const bookings = await RestaurantBooking.find()
      .populate(['guest', 'table'])
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    logger.error(`Get all restaurant bookings error: ${error.message}`);
    next(error);
  }
};
