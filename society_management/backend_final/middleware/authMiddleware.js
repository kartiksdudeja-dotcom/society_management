const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.protect = async (req, res, next) => {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.split(" ")[1] : null;
    if (!token) return res.status(401).json({ message: "Not authorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = user;
    req.userId = user._id;
    req.userRole = user.role;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Not authorized", error: err.message });
  }
};

exports.adminOnly = (req, res, next) => {
  if (req.userRole !== "admin") return res.status(403).json({ message: "Forbidden - admin only" });
  next();
};
