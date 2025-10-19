// src/scripts/createAdmin.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../../models/User";

const uri = process.env.MONGO_URI;

async function createAdmin() {
  try {
    if (!uri) {
      throw new Error("MONGO_URI environment variable is not set");
    }
    await mongoose.connect(uri);
    console.log("✅ Connected to MongoDB");

    const email = "admin@easytek.com";
    const plainPassword = "123321";

    // Check if admin already exists
    const existing = await User.findOne({ email });
    if (existing) {
      console.log("⚠️ Admin already exists");
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    // Create the admin user
    const admin = new User({
      email,
      password: hashedPassword,
      role: "admin",
    });

    await admin.save();
    console.log("🎉 Admin created successfully!");
  } catch (err) {
    console.error("❌ Error creating admin:", err);
  } finally {
    mongoose.connection.close();
  }
}

createAdmin();
