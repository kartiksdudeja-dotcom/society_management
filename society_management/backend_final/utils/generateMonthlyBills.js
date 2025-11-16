const User = require("../models/User");
const Maintenance = require("../models/Maintenance");

// Determine office or shop
function detectPropertyType(flatNumber) {
  flatNumber = flatNumber.toString().toUpperCase();

  // If it starts with SHOP
  if (flatNumber.startsWith("SHOP")) return "shop";

  // Remove A-, B-, C-, etc.
  const cleaned = flatNumber.replace(/[A-Z]-?/g, "");

  const n = parseInt(cleaned);

  if ((n >= 101 && n <= 111) ||
      (n >= 201 && n <= 211) ||
      (n >= 301 && n <= 311) ||
      (n >= 401 && n <= 411)) {
    return "office";
  }

  return null;
}


async function generateMonthlyBills() {
  console.log("🔥 Checking monthly maintenance bills...");

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const users = await User.find({ role: "member" });

  for (const user of users) {
    const flat = user.flatNumber;
    const propertyType = detectPropertyType(flat);

    if (!propertyType) {
      console.log("⚠️ Unknown propertyType for", flat);
      continue;
    }

    const exists = await Maintenance.findOne({
      userId: user._id,
      month: currentMonth,
      year: currentYear,
    });

    if (exists) {
      console.log(`✔ Bill already exists for ${flat}`);
      continue;
    }

    const amountDue = propertyType === "office" ? 2000 : 1500;

    await Maintenance.create({
      userId: user._id,
      flatNumber: flat,
      propertyType,
      month: currentMonth,
      year: currentYear,
      amountDue,
      amountPaid: 0,
      status: "pending",
    });

    console.log(`🔥 Created maintenance bill for ${flat} (${propertyType})`);
  }

  console.log("✅ Monthly bill generation completed.");
}

module.exports = generateMonthlyBills;
