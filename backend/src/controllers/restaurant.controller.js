import RestaurantTable from "../models/RestaurantTable.js";
import RestaurantBooking from "../models/RestaurantBooking.js";

// ============= TABLE MANAGEMENT =============

// @desc    Get all restaurant tables (Public)
// @route   GET /api/restaurant/tables
// @access  Public
export const getRestaurantTables = async (req, res, next) => {
  try {
    const { capacity, location } = req.query;

    let query = { isActive: true };

    if (capacity) query.capacity = { $gte: parseInt(capacity) };
    if (location) query.location = location;

    const tables = await RestaurantTable.find(query).sort({ tableNumber: 1 });

    res.status(200).json({
      success: true,
      count: tables.length,
      data: tables,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single restaurant table
// @route   GET /api/restaurant/tables/:id
// @access  Public
export const getRestaurantTable = async (req, res, next) => {
  try {
    const table = await RestaurantTable.findById(req.params.id);

    if (!table) {
      return res.status(404).json({
        success: false,
        message: "Table not found",
      });
    }

    res.status(200).json({
      success: true,
      data: table,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Check table availability
// @route   GET /api/restaurant/tables/available
// @access  Public
export const checkTableAvailability = async (req, res, next) => {
  try {
    const { bookingDate, timeSlot, guestsCount } = req.query;

    if (!bookingDate || !timeSlot || !guestsCount) {
      return res.status(400).json({
        success: false,
        message: "Booking date, time slot, and guests count are required",
      });
    }

    const date = new Date(bookingDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (date < today) {
      return res.status(400).json({
        success: false,
        message: "Booking date cannot be in the past",
      });
    }

    // Find tables that can accommodate the guest count
    const suitableTables = await RestaurantTable.find({
      isActive: true,
      capacity: { $gte: parseInt(guestsCount) },
    });

    // Check which tables are available
    const availableTables = [];

    for (const table of suitableTables) {
      const existingBooking = await RestaurantBooking.findOne({
        table: table._id,
        bookingDate: date,
        timeSlot,
        status: { $in: ["pending", "confirmed", "seated"] },
      });

      if (!existingBooking) {
        availableTables.push(table);
      }
    }

    res.status(200).json({
      success: true,
      available: availableTables.length > 0,
      count: availableTables.length,
      data: availableTables,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create restaurant table (Admin)
// @route   POST /api/admin/restaurant/tables
// @access  Private/Admin
export const createRestaurantTable = async (req, res, next) => {
  try {
    const table = await RestaurantTable.create(req.body);

    res.status(201).json({
      success: true,
      message: "Table created successfully",
      data: table,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update restaurant table (Admin)
// @route   PUT /api/admin/restaurant/tables/:id
// @access  Private/Admin
export const updateRestaurantTable = async (req, res, next) => {
  try {
    const table = await RestaurantTable.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!table) {
      return res.status(404).json({
        success: false,
        message: "Table not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Table updated successfully",
      data: table,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete restaurant table (Admin)
// @route   DELETE /api/admin/restaurant/tables/:id
// @access  Private/Admin
export const deleteRestaurantTable = async (req, res, next) => {
  try {
    const table = await RestaurantTable.findById(req.params.id);

    if (!table) {
      return res.status(404).json({
        success: false,
        message: "Table not found",
      });
    }

    // Check for future bookings
    const futureBookings = await RestaurantBooking.countDocuments({
      table: req.params.id,
      bookingDate: { $gte: new Date() },
      status: { $in: ["pending", "confirmed", "seated"] },
    });

    if (futureBookings > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete table. ${futureBookings} future bookings exist.`,
      });
    }

    await table.deleteOne();

    res.status(200).json({
      success: true,
      message: "Table deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all tables including inactive (Admin)
// @route   GET /api/admin/restaurant/tables
// @access  Private/Admin
export const getAllRestaurantTablesAdmin = async (req, res, next) => {
  try {
    const tables = await RestaurantTable.find().sort({ tableNumber: 1 });

    // Group by location for stats
    const stats = {
      total: tables.length,
      byLocation: {},
    };

    tables.forEach((table) => {
      if (!stats.byLocation[table.location]) {
        stats.byLocation[table.location] = 0;
      }
      stats.byLocation[table.location]++;
    });

    res.status(200).json({
      success: true,
      count: tables.length,
      stats,
      data: tables,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getRestaurantTables,
  getRestaurantTable,
  checkTableAvailability,
  createRestaurantTable,
  updateRestaurantTable,
  deleteRestaurantTable,
  getAllRestaurantTablesAdmin,
};
