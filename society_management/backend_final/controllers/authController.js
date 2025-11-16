const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// register user (admin-only protection can be added later)
exports.registerUser = async (req, res) => {
  try {
    const { name, flatNumber, email, password, role } = req.body;
    if (!name || !flatNumber || !email || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already used" });

    const user = new User({ name, flatNumber, email, password, role });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.status(201).json({
      message: "User created",
      token,
      user: { id: user._id, name: user.name, email: user.email, flatNumber: user.flatNumber, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Missing email or password" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.json({
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email, flatNumber: user.flatNumber, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// profile
exports.getProfile = async (req, res) => {
  // protect middleware sets req.user
  res.json({ user: req.user });
};
