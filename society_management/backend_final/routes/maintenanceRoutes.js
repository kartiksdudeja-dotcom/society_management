const express = require("express");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const { getMaintenanceSummary } = require("../controllers/maintenanceController");

const router = express.Router();

// Dashboard summary
router.get("/summary", protect, adminOnly, getMaintenanceSummary);

module.exports = router;
