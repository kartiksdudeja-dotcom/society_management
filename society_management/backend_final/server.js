const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const generateMonthlyBills = require("./utils/generateMonthlyBills");
const cleanInvalidUsers = require("./utils/cleanInvalidUsers");
const maintenanceRoutes = require("./routes/maintenanceRoutes");

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use("/api/maintenance", maintenanceRoutes);

// Routes
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");

// Load routes
app.use("/api/auth", authRoutes);
console.log("🔥 Loading admin routes...");
app.use("/api/admin", adminRoutes);
console.log("🔥 Admin routes loaded!");

// Connect MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected Successfully (Atlas)");

    cleanInvalidUsers();     // 👈 RUN CLEANUP
    generateMonthlyBills();  // 👈 GENERATE BILLS
  })
  .catch((err) => console.log("❌ MongoDB Error:", err));


// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
