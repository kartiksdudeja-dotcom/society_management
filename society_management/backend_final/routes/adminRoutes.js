console.log("🔥 adminRoutes.js FILE LOADED");

const express = require("express");
const { protect, adminOnly } = require("../middleware/authMiddleware");
console.log("🔥 Loading controller...");
const {
  getSummary,
  getMembers,
  createUser,
  deleteUser,
  updateUser
} = require("../controllers/adminController");

console.log("🔥 updateUser from controller =", updateUser);


const router = express.Router();

router.get("/summary", protect, adminOnly, getSummary);
router.get("/members", protect, adminOnly, getMembers);
router.post("/create-user", protect, adminOnly, createUser);
router.delete("/delete-user/:id", protect, adminOnly, deleteUser);
router.put("/update-user/:id", protect, adminOnly, updateUser);

module.exports = router;
