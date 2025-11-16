const Maintenance = require("../models/Maintenance");

exports.getMaintenanceSummary = async (req, res) => {
  try {
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();

    const totalBills = await Maintenance.countDocuments({ month, year });
    const pendingBills = await Maintenance.countDocuments({ month, year, status: "pending" });
    const paidBills = await Maintenance.countDocuments({ month, year, status: "paid" });

    res.json({
      totalBills,
      pendingBills,
      paidBills
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
