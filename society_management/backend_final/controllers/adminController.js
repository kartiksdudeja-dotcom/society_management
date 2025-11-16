const User = require("../models/User");

// GET /api/admin/summary
exports.getSummary = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalMembers = await User.countDocuments({ role: "member" });

    res.json({
      admin: req.user, // coming from protect middleware
      totalUsers,
      totalMembers
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/admin/members
exports.getMembers = async (req, res) => {
  console.log("🔥 getMembers API HIT");  // DEBUG 1

  try {
    console.log("User Role:", req.userRole); // DEBUG 2

    const members = await User.find({ role: "member" }).select("-password");
    console.log("Members found:", members.length); // DEBUG 3

    res.json(members);
  } catch (err) {
    console.log("❌ getMembers ERROR:", err);  // DEBUG 4
    res.status(500).json({ message: err.message });
  }
};

// UPDATE /api/admin/update-user/:id
exports.updateUser = async (req, res) => {
  console.log("🔥 updateUser API HIT"); // DEBUG

  try {
    const userId = req.params.id;
    const updateData = req.body;

    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User updated successfully", user });
  } catch (error) {
    console.log("❌ updateUser ERROR:", error.message);
    res.status(500).json({ message: "Update failed", error: error.message });
  }
};





// POST /api/admin/create-user
exports.createUser = async (req, res) => {
  try {
    const { name, email, flatNumber, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.json({ message: "Email already exists" });

    const user = await User.create({
      name,
      email,
      flatNumber,
      password,
      role: "member"
    });

    res.json({ message: "User created", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/admin/delete-user/:id
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
