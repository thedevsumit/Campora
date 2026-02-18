const isSuperAdmin = (req, res, next) => {
  if (req.user.role !== "superAdmin") {
    return res.status(403).json({
      message: "Access denied. Super Admin only.",
    });
  }
  next();
};

module.exports = isSuperAdmin;
