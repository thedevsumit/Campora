const express = require("express");
const protectRoute = require("../middleware/auth.middleware");
const { isAdmin } = require("../middleware/rbac.middleware");
const Role = require("../models/role.model");
const Permission = require("../models/permission.model");

const router = express.Router();

// Create role
router.post("/", protectRoute, isAdmin, async (req, res) => {
  try {
    const { name, description, isSystemRole, permissions, scope } = req.body;
    const role = await Role.create({ name, description, isSystemRole, permissions, scope });
    return res.status(201).json({ message: "Role created", role });
  } catch (error) {
    console.error("createRole error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Get all roles
router.get("/", protectRoute, async (req, res) => {
  try {
    const roles = await Role.find().populate("permissions");
    return res.status(200).json({ roles });
  } catch (error) {
    console.error("getRoles error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Get role by ID
router.get("/:roleId", protectRoute, async (req, res) => {
  try {
    const role = await Role.findById(req.params.roleId).populate("permissions");
    if (!role) return res.status(404).json({ message: "Role not found" });
    return res.status(200).json({ role });
  } catch (error) {
    console.error("getRoleById error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Update role
router.put("/:roleId", protectRoute, isAdmin, async (req, res) => {
  try {
    const { name, description, permissions, scope } = req.body;
    const role = await Role.findByIdAndUpdate(
      req.params.roleId,
      { name, description, permissions, scope },
      { new: true }
    ).populate("permissions");
    if (!role) return res.status(404).json({ message: "Role not found" });
    return res.status(200).json({ message: "Role updated", role });
  } catch (error) {
    console.error("updateRole error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Delete role
router.delete("/:roleId", protectRoute, isAdmin, async (req, res) => {
  try {
    const role = await Role.findById(req.params.roleId);
    if (!role) return res.status(404).json({ message: "Role not found" });
    if (role.isSystemRole) return res.status(400).json({ message: "Cannot delete system role" });
    await Role.findByIdAndDelete(req.params.roleId);
    return res.status(200).json({ message: "Role deleted" });
  } catch (error) {
    console.error("deleteRole error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Add permission to role
router.post("/:roleId/permissions", protectRoute, isAdmin, async (req, res) => {
  try {
    const { permissionId } = req.body;
    const role = await Role.findById(req.params.roleId);
    if (!role) return res.status(404).json({ message: "Role not found" });
    if (!role.permissions.includes(permissionId)) {
      role.permissions.push(permissionId);
      await role.save();
    }
    const updated = await Role.findById(req.params.roleId).populate("permissions");
    return res.status(200).json({ message: "Permission added", role: updated });
  } catch (error) {
    console.error("addPermissionToRole error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Remove permission from role
router.delete("/:roleId/permissions/:permId", protectRoute, isAdmin, async (req, res) => {
  try {
    const role = await Role.findById(req.params.roleId);
    if (!role) return res.status(404).json({ message: "Role not found" });
    role.permissions = role.permissions.filter(p => p.toString() !== req.params.permId);
    await role.save();
    const updated = await Role.findById(req.params.roleId).populate("permissions");
    return res.status(200).json({ message: "Permission removed", role: updated });
  } catch (error) {
    console.error("removePermissionFromRole error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Seed default roles
router.post("/seed", protectRoute, isAdmin, async (req, res) => {
  try {
    const defaultPermissions = [
      { name: "event:create", description: "Create events", category: "event" },
      { name: "event:edit:own", description: "Edit own events", category: "event" },
      { name: "event:edit:any", description: "Edit any event", category: "event" },
      { name: "event:delete", description: "Delete events", category: "event" },
      { name: "event:approve", description: "Approve events", category: "event" },
      { name: "event:register", description: "Register for events", category: "event" },
      { name: "event:view", description: "View events", category: "event" },
      { name: "booking:create", description: "Create bookings", category: "booking" },
      { name: "booking:approve", description: "Approve bookings", category: "booking" },
      { name: "booking:view", description: "View bookings", category: "booking" },
      { name: "resource:create", description: "Create resources", category: "resource" },
      { name: "resource:manage", description: "Manage resources", category: "resource" },
      { name: "resource:view", description: "View resources", category: "resource" },
      { name: "club:manage", description: "Manage clubs", category: "club" },
      { name: "club:join", description: "Join clubs", category: "club" },
      { name: "chat:access", description: "Access chat", category: "chat" },
      { name: "analytics:view", description: "View analytics", category: "analytics" },
      { name: "analytics:export", description: "Export analytics", category: "analytics" },
      { name: "role:manage", description: "Manage roles", category: "admin" },
      { name: "user:manage", description: "Manage users", category: "admin" },
    ];

    const createdPerms = await Permission.insertMany(defaultPermissions);
    const permMap = {};
    createdPerms.forEach(p => { permMap[p.name] = p._id; });

    const defaultRoles = [
      {
        name: "participant",
        description: "Regular user - can join clubs, register for events, book resources",
        isSystemRole: true,
        scope: "system",
        permissions: [permMap["event:register"], permMap["event:view"], permMap["resource:view"], permMap["club:join"], permMap["chat:access"]]
      },
      {
        name: "organizer",
        description: "Club/committee leads - can create events, manage bookings",
        isSystemRole: true,
        scope: "system",
        permissions: [permMap["event:create"], permMap["event:edit:own"], permMap["event:view"], permMap["booking:create"], permMap["resource:view"], permMap["club:join"], permMap["chat:access"], permMap["analytics:view"]]
      },
      {
        name: "admin",
        description: "System administrator - full access except role management",
        isSystemRole: true,
        scope: "system",
        permissions: Object.values(permMap).filter((_, i) => !["analytics:export", "role:manage", "role:create", "role:delete"].includes(defaultPermissions[i]?.name))
      }
    ];

    const adminPerms = defaultRoles[2].permissions.filter(p => p !== undefined);
    defaultRoles[2].permissions = adminPerms;

    await Role.insertMany(defaultRoles);
    return res.status(201).json({ message: "Default roles and permissions seeded" });
  } catch (error) {
    console.error("seedRoles error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
