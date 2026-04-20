const Booking = require("../models/booking.model");

const checkBookingConflicts = async (req, res, next) => {
  try {
    const { resource, slots } = req.body;

    if (!resource || !slots || !slots.length) {
      return next();
    }

    const Booking = require("../models/booking.model");

    for (const slot of slots) {
      // For community resources with date ranges, check all dates in range
      if (!slot.startTime || !slot.endTime) {
        const dateFrom = new Date(slot.date);
        const dateTo = slot.dateTo ? new Date(slot.dateTo) : dateFrom;

        // Check each day in the range
        const currentDate = new Date(dateFrom);
        while (currentDate <= dateTo) {
          const dayStart = new Date(currentDate);
          dayStart.setHours(0, 0, 0, 0);
          const dayEnd = new Date(currentDate);
          dayEnd.setHours(23, 59, 59, 999);

          const conflicting = await Booking.findOne({
            resource,
            status: { $in: ["approved", "pending"] },
            $or: [
              { "slots.date": { $gte: dayStart, $lte: dayEnd } },
              { "slots.dateTo": { $gte: dayStart, $lte: dayEnd } },
              {
                "slots.date": { $lte: dayStart },
                "slots.dateTo": { $gte: dayEnd }
              }
            ]
          }).populate("bookedBy", "fullName email");

          if (conflicting) {
            const bookedByName = conflicting.bookedBy?.fullName || "Someone";
            return res.status(409).json({
              message: `Already booked by ${bookedByName} for ${currentDate.toLocaleDateString()}`,
              conflictingBooking: conflicting._id,
              bookedBy: conflicting.bookedBy,
              conflictDate: currentDate.toISOString()
            });
          }
          currentDate.setDate(currentDate.getDate() + 1);
        }
        continue;
      }

      // For admin resources with time slots, check time overlap
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
      }).populate("bookedBy", "fullName email");

      if (conflicting) {
        const bookedByName = conflicting.bookedBy?.fullName || "Someone";
        const conflictSlot = conflicting.slots.find(s =>
          s.startTime && s.endTime &&
          s.startTime < slot.endTime && s.endTime > slot.startTime
        );
        return res.status(409).json({
          message: `Already booked by ${bookedByName} from ${conflictSlot?.startTime || ""} to ${conflictSlot?.endTime || ""}`,
          conflictingBooking: conflicting._id,
          bookedBy: conflicting.bookedBy,
          conflictSlot
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
