// scripts/seed.ts
import mongoose from "mongoose";
import Cd from "../../models/Cd";
import dbConnect from "../../lib/dbConnect";
import dotenv from "dotenv";

// Load environment variables from multiple possible locations
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

async function seed() {
  try {
    // Debug: Check if MONGO_URI is loaded
    console.log("🔍 MONGO_URI:", process.env.MONGO_URI ? "✅ Found" : "❌ Not found");
    
    await dbConnect(); // ✅ use your existing connection helper

    console.log("🌱 Starting seeding...");

    const cds = [
      {
        name: "FIFA 24",
        category: "PS5",
        quantity: 3,
        status: "available",
        pricePerDay: 5,
        image: "https://example.com/fifa24.jpg",
        description: "Latest FIFA football game",
        releaseDate: new Date("2024-09-27"),
      },
      {
        name: "Call of Duty: Modern Warfare 3",
        category: "PS4",
        quantity: 2,
        status: "available",
        pricePerDay: 6,
        image: "https://example.com/codmw3.jpg",
        description: "Action FPS game",
        releaseDate: new Date("2023-11-10"),
      },
    ];

    // Optional: clear old data before inserting
    await Cd.deleteMany({});
    console.log("🧹 Old CD data cleared");

    await Cd.insertMany(cds);
    console.log("✅ New CD data inserted successfully");

    await mongoose.disconnect();
    console.log("🔌 MongoDB disconnected");
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    process.exit(1);
  }
}

seed();
