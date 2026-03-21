require("dotenv").config();

const app = require("./src/app");
const connectDB = require("./src/config/db");
const seedAll = require("./src/seeds");

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";
const SHOULD_SEED = process.env.SEED === "true";

// Start server function
const startServer = async () => {
  try {
    console.log(`🚀 Starting server in ${NODE_ENV} mode...`);

    // 1. Connect database
    await connectDB();
    console.log("✅ Database connected");

    // 2. Seed data (optional)
    if (NODE_ENV === "development" && SHOULD_SEED) {
      console.log("🌱 Seeding data...");
      await seedAll();
      console.log("✅ Seed completed");
    }

    // 3. Start server
    app.listen(PORT, () => {
      console.log(`🔥 Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

// Run server
startServer();