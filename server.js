require("dotenv").config();
const app = require("./src/app");
const seedAll = require("./src/seeds");
const connectDB = require("./src/config/db");

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    // 1. connect DB
    await connectDB();

    // 2. seed data (chỉ dev)
    if (process.env.NODE_ENV === "development") {
      await seedAll();
    }

    // 3. start server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("Server error:", error);
    process.exit(1);
  }
})();