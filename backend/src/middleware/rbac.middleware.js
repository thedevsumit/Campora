const Role = require("../models/role.model");
const Permission = require("../models/permission.model");

const checkPermission = (permission) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      if (req.user.role === "superAdmin") {
        return next();
      }

      const userRole = req.user.userRole || "participant";

      if (userRole === "admin") {
        const adminExcluded = ["analytics:export", "role:manage", "role:create", "role:delete"];
        if (adminExcluded.includes(permission)) {
          return res.status(403).json({ message: "Forbidden - Admin cannot access this permission" });
        }
        return next();
      }

      if (userRole === "organizer") {
        const organizerPerms = [
          "event:create", "event:edit:own", "event:view",
          "booking:create", "resource:view",
          "club:join", "chat:access"
        ];
        if (!organizerPerms.includes(permission)) {
          return res.status(403).json({ message: "Insufficient permissions" });
        }
        return next();
      }

      if (userRole === "participant") {
        const participantPerms = [
          "event:register", "event:view",
          "booking:create:own", "resource:view",
          "club:join", "chat:access"
        ];
        if (!participantPerms.includes(permission)) {
          return res.status(403).json({ message: "Insufficient permissions" });
        }
        return next();
      }

      next();
    } catch (error) {
      console.error("checkPermission error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  };
};

const isAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (req.user.role !== "superAdmin" && req.user.userRole !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }
    next();
  } catch (error) {
    console.error("isAdmin error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const isOrganizer = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const userRole = req.user.userRole || "participant";
    const allowed = ["admin", "organizer", "superAdmin"];
    if (!allowed.includes(userRole)) {
      return res.status(403).json({ message: "Organizer access required" });
    }
    next();
  } catch (error) {
    console.error("isOrganizer error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { checkPermission, isAdmin, isOrganizer };
