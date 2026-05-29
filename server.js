// dotenv có thể được sử dụng để tải các biến môi trường từ file .env vào process.env, giúp quản lý cấu hình dễ dàng hơn
require("dotenv").config();

const createSuperAdmin = require("./src/seeds/superAdmin.seed");
const app = require("./src/app");
const connectDB = require("./src/config/db");
const seedAll = require("./src/seeds");
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";
const SHOULD_SEED = process.env.SEED === "true";

// Start server function
const startServer = async () => {
  try {

    // 1. Connect database
    await connectDB();

    // 2. Seed data (optional)
    // Tạo super admin trước để đảm bảo luôn có tài khoản quản trị cao nhất, sau đó mới seed các dữ liệu khác nếu cần
    await createSuperAdmin();
    // Nếu đang ở môi trường phát triển và biến SEED được đặt thành true, thì sẽ thực hiện seeding dữ liệu mẫu
    if (NODE_ENV === "development" && SHOULD_SEED) {
      await seedAll();
    }
    
    // 3. Start server
    app.listen(PORT, () => {
      // Server is running.
    });

  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

// Run server
startServer();