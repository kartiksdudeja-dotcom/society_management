const mongoose = require("mongoose");

const MaintenanceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    flatNumber: {
      type: String,
      required: true,
    },

    propertyType: {
      type: String,
      enum: ["office", "shop"],
      required: true,
    },

    month: {
      type: Number, // 1 - 12
      required: true,
    },

    year: {
      type: Number, // 2025 etc.
      required: true,
    },

    amountDue: {
      type: Number,
      required: true,
    },

    amountPaid: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["pending", "partial", "paid", "advance"],
      default: "pending",
    },

    payments: [
      {
        amount: Number,
        date: Date,
      },
    ],
  },

  { timestamps: true }
);

module.exports = mongoose.model("Maintenance", MaintenanceSchema);
