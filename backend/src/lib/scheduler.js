const Resource = require("../models/resource.model");

const SCHEDULED_RESOURCE_COUNT = 5;

function scheduleMidnightRender(io) {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);

  const msUntilMidnight = midnight.getTime() - now.getTime();

  setTimeout(async () => {
    await renderScheduledResources(io);
    setInterval(async () => {
      await renderScheduledResources(io);
    }, 24 * 60 * 60 * 1000);
  }, msUntilMidnight);
}

async function renderScheduledResources(io) {
  try {
    const scheduledResources = await Resource.find({
      isScheduledResource: true,
      isActive: true,
      maintenanceMode: false,
    }).sort({ scheduledSlot: 1 }).limit(SCHEDULED_RESOURCE_COUNT);

    if (scheduledResources.length === 0) {
      return;
    }

    const resourceIds = scheduledResources.map(r => r._id);

    await Resource.updateMany(
      { _id: { $in: resourceIds } },
      { lastRenderedAt: new Date() }
    );

    if (io) {
      io.emit("scheduledResourcesUpdated", {
        resources: scheduledResources.map(r => ({
          _id: r._id,
          name: r.name,
          code: r.code,
          type: r.type,
          location: r.location,
          capacity: r.capacity,
          amenities: r.amenities,
          availableStartTime: r.availableStartTime,
          availableEndTime: r.availableEndTime,
          requiresApproval: r.requiresApproval,
        })),
        renderedAt: new Date(),
      });
    }

    return scheduledResources;
  } catch (error) {
    // Silent failure for scheduled task
  }
}

async function getScheduledResources() {
  return Resource.find({
    isScheduledResource: true,
    isActive: true,
  }).sort({ scheduledSlot: 1 }).limit(SCHEDULED_RESOURCE_COUNT);
}

async function assignScheduledSlot(resourceId, slot) {
  if (slot < 1 || slot > SCHEDULED_RESOURCE_COUNT) {
    throw new Error(`Slot must be between 1 and ${SCHEDULED_RESOURCE_COUNT}`);
  }

  const existing = await Resource.findOne({ scheduledSlot: slot, _id: { $ne: resourceId } });
  if (existing) {
    throw new Error(`Slot ${slot} is already assigned to ${existing.name}`);
  }

  return Resource.findByIdAndUpdate(
    resourceId,
    { isScheduledResource: true, scheduledSlot: slot },
    { new: true }
  );
}

module.exports = { scheduleMidnightRender, renderScheduledResources, getScheduledResources, assignScheduledSlot };