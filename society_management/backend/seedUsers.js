require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../backend_final/models/User');

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("DB connected");

    // Delete all existing users
    await User.deleteMany({});

    // Create admin user
    const hashedAdminPass = await bcrypt.hash("admin123", 10);

    await User.create({
      name: "Admin",
      email: "admin@local",
      password: hashedAdminPass,
      flatNumber: "ADMIN-0",
      role: "admin"
    });

    // Create 54 normal users
    const arr = [];
    for (let i = 1; i <= 54; i++) {
      const hashedPass = await bcrypt.hash("123456", 10);

      arr.push({
        name: `User ${i}`,
        email: `user${i}@example.com`,
        password: hashedPass,
        flatNumber: `A-${100 + i}`,
        role: "member"
      });
    }

    await User.insertMany(arr);

    console.log("✅ Users seeded successfully");
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.disconnect();
  }
}

seed();
