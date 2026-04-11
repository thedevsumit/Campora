const Booking = require("../models/booking.model");

const checkBookingConflicts = async (req, res, next) => {
  try {
    const { resource, slots } = req.body;

    if (!resource || !slots || !slots.length) {
      return next();
    }

    const Booking = require("../models/booking.model");

    for (const slot of slots) {
      const conflicting = await Booking.findOne({
        resource,
        status: { $in: ["approved", "pending"] },
        "slots.date": slot.date,
        $or: [
          {
            "slots.startTime": { $lt: slot.endTime },
            "slots.endTime": { $gt: slot.startTime }
          }
        ]
      });

      if (conflicting) {
        return res.status(409).json({
          message: "Booking conflict detected",
          conflictingBooking: conflicting._id
        });
      }
    }

    next();
  } catch (error) {
    console.error("checkBookingConflicts error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { checkBookingConflicts };
