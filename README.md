# Dermify Server - Backend API cho Nền Tảng Thương Mại Điện Tử Mỹ Phẩm

## Mục Lục
1. [Giới Thiệu](#giới-thiệu)
2. [Công Nghệ Sử Dụng](#công-nghệ-sử-dụng)
3. [Tính Năng Hệ Thống](#tính-năng-hệ-thống)
4. [Tổng Quan Cơ Sở Dữ Liệu](#tổng-quan-cơ-sở-dữ-liệu)
5. [Cấu Trúc Dự Án](#cấu-trúc-dự-án)
6. [Hướng Dẫn Cài Đặt](#hướng-dẫn-cài-đặt)
7. [Tài Khoản Kiểm Thử](#tài-khoản-kiểm-thử)
8. [Phát Triển Tương Lai](#phát-triển-tương-lai)
9. [Nhóm Phát Triển](#nhóm-phát-triển)

---

## Giới Thiệu

### Vấn Đề Kinh Doanh
Ngành thương mại điện tử mỹ phẩm đang phát triển nhanh chóng, nhưng khách hàng cần một nền tảng đáng tin cậy để:
- **Duyệt và mua sắm** các sản phẩm mỹ phẩm chất lượng
- **Tìm kiếm sản phẩm** theo danh mục, thương hiệu, giá cả
- **Đánh giá và review** sản phẩm dựa trên kinh nghiệm cá nhân
- **Quản lý đơn hàng** từ đặt mua đến giao hàng

Từ phía quản lý, các nhân viên cần công cụ để:
- **Quản lý sản phẩm** (thêm, sửa, xóa, ẩn hiện)
- **Quản lý danh mục** sản phẩm phân cấp
- **Theo dõi đơn hàng** và trạng thái thanh toán
- **Quản lý người dùng** hệ thống

### Mục Tiêu Dự Án
Xây dựng Backend API mạnh mẽ cho nền tảng thương mại điện tử mỹ phẩm (Dermify) với:
- ✅ Hệ thống xác thực JWT an toàn
- ✅ Quản lý người dùng phân cấp (Khách hàng, Nhân viên, Quản trị viên)
- ✅ Quản lý sản phẩm & danh mục đa cấp
- ✅ Giỏ hàng và quản lý đơn hàng toàn vẹn
- ✅ Hệ thống đánh giá & review sản phẩm
- ✅ Hỗ trợ nhiều phương thức thanh toán
- ✅ Tải ảnh lên qua Cloudinary

### Đối Tượng Sử Dụng
1. **Khách hàng bán lẻ**: Duyệt, tìm kiếm, mua sắm, theo dõi đơn hàng, đánh giá sản phẩm
2. **Nhân viên bán hàng**: Quản lý sản phẩm, xử lý đơn hàng, hỗ trợ khách hàng
3. **Quản trị viên**: Quản lý toàn bộ hệ thống, thống kê, báo cáo doanh số

---

## Công Nghệ Sử Dụng

### Backend
- **Node.js**: Runtime JavaScript phía máy chủ
- **Express.js**: Framework web siêu nhẹ, linh hoạt
- **MongoDB**: Cơ sở dữ liệu NoSQL (mô hình tài liệu)
- **Mongoose**: ODM (Object Document Mapper) cho MongoDB

### Authentication & Security
- **JWT (JSON Web Tokens)**: Xác thực không trạng thái (stateless)
- **bcrypt**: Hashing mật khẩu an toàn

### Gửi Email
- **Nodemailer**: Gửi email qua SMTP server
- **SendGrid**: Dịch vụ gửi email đám mây
- **Brevo (sib-api-v3-sdk)**: Nền tảng gửi email & SMS

### Quản Lý Tệp & Ảnh
- **Multer**: Middleware xử lý upload tệp tin
- **Cloudinary**: Dịch vụ lưu trữ & tối ưu hóa ảnh

### Công Cụ Phát Triển
- **Nodemon**: Tự động khởi động lại khi mã thay đổi
- **cross-env**: Đặt biến môi trường đa nền tảng
- **CORS**: Chia sẻ tài nguyên giữa các domain

---

## Tính Năng Hệ Thống

### Tính Năng Quản Trị Viên

#### 1. Quản Lý Người Dùng
- **Xem danh sách tất cả người dùng** (khách hàng + nhân viên) với phân trang
- **Tạo tài khoản người dùng mới**
- **Cập nhật trạng thái người dùng** (Active/Banned/Inactive)
- **Xóa mềm người dùng** (không xóa dữ liệu vĩnh viễn)

#### 2. Quản Lý Nhân Viên
- **Tạo nhân viên mới** với chức vụ (Staff/Manager)
- **Quản lý danh sách nhân viên** (xem, cập nhật, xóa)
- **Phân quyền chức vụ**: Staff (nhân viên) hoặc Manager (quản lý)
- **Super Admin**: Tạo tài khoản Admin mới

#### 3. Quản Lý Sản Phẩm
- **Thêm sản phẩm mới** với thông tin: tên, giá gốc, giá bán, hình ảnh, mô tả, kho hàng
- **Cập nhật thông tin sản phẩm**
- **Ẩn/Hiện sản phẩm** (status: active, hidden, draft)
- **Xóa mềm sản phẩm** (giữ lịch sử)
- **Xem số lượng đã bán, rating trung bình**

#### 4. Quản Lý Danh Mục
- **Tạo danh mục sản phẩm** (hỗ trợ phân cấp cha-con)
- **Cập nhật danh mục**
- **Ẩn/Hiện danh mục** (status: active, hidden)
- **Xóa danh mục** (có kiểm tra ràng buộc)
- **Tạo đường dẫn slug tự động** (VD: "mỹ-phẩm-da" từ "Mỹ Phẩm Da")

#### 5. Quản Lý Đơn Hàng
- **Xem danh sách đơn hàng** với bộ lọc:
  - Theo trạng thái đơn (pending, confirmed, shipping, delivered, cancelled)
  - Theo trạng thái thanh toán (pending, paid, refunded)
  - Theo khoảng thời gian
  - Tìm kiếm theo mã đơn hàng
- **Cập nhật trạng thái đơn hàng** (pending → confirmed → shipping → delivered)
- **Cập nhật trạng thái thanh toán** (pending → paid/refunded)
- **Xem chi tiết đơn hàng** với danh sách sản phẩm
- **Thống kê đơn hàng**:
  - Tổng doanh thu theo trạng thái
  - Số lượng đơn hàng theo từng trạng thái
  - Thống kê theo khoảng thời gian

#### 6. Quản Lý Đánh Giá
- **Ẩn/Hiện đánh giá** của khách hàng (status: active, hidden)
- **Xóa đánh giá không phù hợp** (xóa mềm)
- **Xem tất cả đánh giá của sản phẩm**

#### 7. Tải Ảnh Lên
- **Upload ảnh lên Cloudinary** cho sản phẩm, avatar
- **Tối ưu hóa ảnh** tự động (resize, compress)

### Tính Năng Khách Hàng

#### 1. Xác Thực & Tài Khoản
- **Đăng ký tài khoản mới** với email, mật khẩu
- **Xác thực email** qua link gửi vào hộp thư
- **Đăng nhập** bằng email/mật khẩu
- **Làm mới token** (Refresh Token) khi Access Token hết hạn
- **Quên mật khẩu**: Gửi link reset mật khẩu vào email
- **Đặt lại mật khẩu** từ link email
- **Đăng xuất** (xóa Refresh Token)

#### 2. Quản Lý Hồ Sơ Cá Nhân
- **Xem hồ sơ cá nhân** (tên, email, điện thoại, giới tính, ngày sinh)
- **Cập nhật hồ sơ cá nhân**
- **Tải ảnh đại diện** (Avatar)

#### 3. Quản Lý Địa Chỉ
- **Thêm địa chỉ giao hàng mới** (tên người nhận, điện thoại, tỉnh/thành phố, quận/huyện, phường/xã, đường)
- **Xem danh sách địa chỉ**
- **Cập nhật địa chỉ**
- **Xóa địa chỉ**
- **Đặt địa chỉ mặc định** (địa chỉ mặc định được chọn khi tạo đơn hàng)

#### 4. Duyệt & Tìm Kiếm Sản Phẩm
- **Xem danh sách sản phẩm** với phân trang
- **Tìm kiếm sản phẩm** theo:
  - Từ khóa (tên sản phẩm, thương hiệu)
  - Danh mục
  - Khoảng giá
  - Rating
- **Xem chi tiết sản phẩm**:
  - Tên, giá, giá gốc, mô tả
  - Danh sách ảnh
  - Rating trung bình
  - Số lượng đánh giá
  - Số lượng đã bán
  - Kho hàng có sẵn

#### 5. Giỏ Hàng
- **Thêm sản phẩm vào giỏ**
- **Xem giỏ hàng**
- **Cập nhật số lượng sản phẩm** trong giỏ
- **Xóa sản phẩm khỏi giỏ**
- **Xóa toàn bộ giỏ hàng**

#### 6. Đơn Hàng
- **Tạo đơn hàng** từ giỏ hàng:
  - Chọn địa chỉ giao hàng
  - Chọn phương thức thanh toán (COD, VNPay, Momo, Chuyển khoản)
  - Tính tổng tiền = (tổng sản phẩm - giảm giá + phí ship)
- **Xem danh sách đơn hàng cá nhân** (đã tạo)
- **Xem chi tiết đơn hàng**:
  - Mã đơn hàng
  - Danh sách sản phẩm đã mua (tên, giá, số lượng tại thời điểm mua)
  - Thông tin giao hàng
  - Trạng thái đơn hàng
  - Trạng thái thanh toán
  - Tổng tiền thanh toán
- **Hủy đơn hàng** (chỉ khi trạng thái là pending hoặc confirmed)
- **Xem đơn hàng có giá cao nhất** (API thống kê)

#### 7. Đánh Giá & Review
- **Thêm đánh giá sản phẩm** (số sao 1-5, bình luận, ảnh)
- **Cập nhật đánh giá của mình**
- **Xóa đánh giá của mình**
- **Xem danh sách đánh giá của sản phẩm** (công khai)

#### 8. Danh Mục
- **Xem danh sách danh mục** (chế độ danh sách hoặc cây phân cấp)
- **Xem chi tiết danh mục** kèm sản phẩm

---

## Tổng Quan Cơ Sở Dữ Liệu

### Các Thực Thể Chính

#### 1. **Account** (Tài Khoản)
- Lưu thông tin đăng nhập của tất cả người dùng
- **Trường**: email (unique), password (hashed), role, status, refreshToken, lastLogin
- **Vai trò**: customer, staff, admin, super_admin
- **Trạng thái**: pending (chờ xác thực), active (hoạt động), inactive (vô hiệu)

#### 2. **Customer** (Khách Hàng)
- Hồ sơ chi tiết của khách hàng
- **Liên kết**: 1 Account ↔ 1 Customer
- **Trường**: accountId, name, phone, avatar, addresses (mảng), gender, dateOfBirth
- **Địa chỉ**: Mỗi khách hàng có thể lưu nhiều địa chỉ (subdocument)

#### 3. **Staff** (Nhân Viên)
- Thông tin nhân viên/quản lý
- **Liên kết**: 1 Account ↔ 1 Staff
- **Trường**: accountId, name, phone, avatar, position (staff/manager), isActive
- **Quyền**: Dựa trên role trong Account

#### 4. **Product** (Sản Phẩm)
- Thông tin chi tiết sản phẩm
- **Trường**: name, slug (unique), price, originalPrice, brand, description, images, categoryId
- **Theo dõi**: stock, soldCount, ratingAvg, reviewCount
- **Trạng thái**: active, hidden, draft
- **Tìm kiếm**: Full-text search trên name, brand; index trên categoryId, price, ratingAvg
- **Soft delete**: isDeleted flag

#### 5. **Category** (Danh Mục)
- Danh mục sản phẩm phân cấp
- **Cấu trúc cha-con**: parentId trỏ đến danh mục cha (null nếu là root)
- **Trường**: name, slug, parentId, path, level, status
- **Hỗ trợ**: Tạo cây phân cấp danh mục
- **Soft delete**: isDeleted flag

#### 6. **Cart** (Giỏ Hàng)
- Giỏ hàng tạm của khách hàng
- **Liên kết**: 1 Customer → 1 Cart
- **Items**: Mảng các sản phẩm (productId, quantity)
- **Tính chất**: Tạm thời, xóa khi đặt hàng

#### 7. **Order** (Đơn Hàng)
- Thông tin đơn hàng hoàn chỉnh
- **Mã đơn**: orderCode (unique, định dạng: DH202401010001)
- **Sản phẩm**: items (mảng snapshot: productId, name, price, quantity, image tại thời điểm mua)
- **Tiền tệ**: subtotal, discountAmount, shippingFee, totalPrice
- **Địa chỉ**: Lưu trực tiếp (fullName, phone, province, district, ward, street, note)
- **Thanh toán**: paymentMethod (cod, vnpay, momo, banking), paymentStatus (pending, paid, refunded)
- **Trạng thái**: orderStatus (pending, confirmed, shipping, delivered, cancelled)
- **Timeline**: createdAt, confirmedAt, shippedAt, deliveredAt, cancelledAt
- **Methods**: cancel(), confirm(), updateShippingStatus()
- **Statics**: findByCustomer(), getStatistics()

#### 8. **Review** (Đánh Giá)
- Đánh giá & review sản phẩm
- **Liên kết**: Review nhiều-một với Product và Customer
- **Trường**: productId, userId, rating (1-5), comment, images, isEdited, status
- **Unique**: (userId, productId) - mỗi khách chỉ review 1 lần/sản phẩm
- **Aggregation**: calcAverageRatings() - tính rating trung bình tự động cập nhật vào Product

### Quan Hệ Giữa Các Thực Thể
```
Account → Customer → Cart → Order
         ↓
       Staff
         
Product ← Category (phân cấp)
         ↓
       Review ← Customer
```

---

## Cấu Trúc Dự Án

```
dermify-server/
│
├── src/                           # Mã nguồn chính
│   │
│   ├── modules/                   # Các module chức năng
│   │   ├── auth/                  # Xác thực
│   │   │   ├── auth.controller.js # Xử lý logic đăng nhập/đăng ký
│   │   │   ├── auth.service.js    # Business logic
│   │   │   ├── auth.routes.js     # Định tuyến
│   │   │   └── auth.validation.js # Xác thực dữ liệu
│   │   │
│   │   ├── customer/              # Quản lý khách hàng
│   │   │   ├── customer.controller.js
│   │   │   ├── customer.model.js  # Schema customer
│   │   │   ├── customer.service.js
│   │   │   └── customer.routes.js
│   │   │
│   │   ├── staff/                 # Quản lý nhân viên
│   │   │   ├── staff.controller.js
│   │   │   ├── staff.model.js     # Schema staff
│   │   │   ├── staff.service.js
│   │   │   ├── staff.routes.js
│   │   │   └── staff.validation.js
│   │   │
│   │   ├── product/               # Quản lý sản phẩm
│   │   │   ├── product.controller.js
│   │   │   ├── product.model.js   # Schema product
│   │   │   ├── product.service.js
│   │   │   └── product.routes.js
│   │   │
│   │   ├── category/              # Quản lý danh mục
│   │   │   ├── category.controller.js
│   │   │   ├── category.model.js  # Schema category
│   │   │   ├── category.service.js
│   │   │   └── category.routes.js
│   │   │
│   │   ├── cart/                  # Giỏ hàng
│   │   │   ├── cart.controller.js
│   │   │   ├── cart.model.js      # Schema cart
│   │   │   ├── cart.service.js
│   │   │   └── cart.routes.js
│   │   │
│   │   ├── order/                 # Quản lý đơn hàng
│   │   │   ├── order.controller.js
│   │   │   ├── order.model.js     # Schema order (chi tiết)
│   │   │   ├── order.service.js
│   │   │   ├── order.admin.controller.js # Chức năng admin
│   │   │   └── order.routes.js
│   │   │
│   │   ├── review/                # Đánh giá sản phẩm
│   │   │   ├── review.controller.js
│   │   │   ├── review.model.js    # Schema review
│   │   │   ├── review.service.js
│   │   │   └── review.routes.js
│   │   │
│   │   ├── account/               # Thực thể Account
│   │   │   └── account.model.js   # Schema account
│   │   │
│   │   ├── upload/                # Xử lý upload tệp
│   │   │   └── upload.routes.js
│   │   │
│   │   └── user-management/       # Quản lý người dùng (Admin)
│   │       ├── user-management.controller.js
│   │       └── user-management.routes.js
│   │
│   ├── middleware/                # Các middleware
│   │   ├── authMiddleware.js      # Xác thực JWT
│   │   ├── requireRole.js         # Kiểm tra quyền người dùng
│   │   ├── errorHandler.js        # Xử lý lỗi tập trung
│   │   └── upload.js              # Xử lý upload tệp (Multer)
│   │
│   ├── config/                    # Cấu hình
│   │   ├── db.js                  # Kết nối MongoDB
│   │   └── cloudinary.js          # Cấu hình Cloudinary
│   │
│   ├── utils/                     # Tiện ích chung
│   │   └── sendEmail.js           # Gửi email (Nodemailer, SendGrid, Brevo)
│   │
│   ├── seeds/                     # Dữ liệu mẫu
│   │   ├── superAdmin.seed.js     # Tạo Super Admin
│   │   ├── admin.seed.js          # Tạo Admin
│   │   ├── staff.seed.js          # Tạo Nhân viên
│   │   ├── category.seed.js       # Tạo Danh mục
│   │   ├── product.seed.js        # Tạo Sản phẩm
│   │   └── index.js               # Gọi tất cả seed
│   │
│   └── app.js                     # Cấu hình Express chính
│
├── server.js                      # Entry point (khởi động server)
├── package.json                   # Dependencies & scripts
├── package-lock.json              # Lock versions
├── .env                           # Biến môi trường (GIT IGNORE)
├── .gitignore                     # Các tệp bỏ qua
└── README.md                      # Tài liệu này
```

### Trách Nhiệm Của Các Thư Mục

| Thư Mục | Chức Năng |
|---------|----------|
| **modules/** | Chứa tất cả logic kinh doanh, model, controller, service, routes |
| **middleware/** | Middleware xác thực, phân quyền, xử lý lỗi, upload tệp |
| **config/** | Cấu hình kết nối database, dịch vụ bên ngoài |
| **utils/** | Hàm tiện ích dùng chung (email, file, etc) |
| **seeds/** | Dữ liệu mẫu để test và phát triển |

---

## Hướng Dẫn Cài Đặt

### Yêu Cầu Tiên Quyết
- **Node.js** ≥ v16.0.0
- **npm** ≥ v8.0.0
- **MongoDB** (local hoặc MongoDB Atlas)
- Tài khoản **Cloudinary** (để upload ảnh)
- Tài khoản **SendGrid** hoặc **Brevo** (để gửi email)

### Bước 1: Clone Repository
```bash
git clone https://github.com/quoctinhstudy1911-crypto/dermify-server.git
cd dermify-server
```

### Bước 2: Cài Đặt Dependencies
```bash
npm install
```

### Bước 3: Cấu Hình Biến Môi Trường
Tạo file `.env` ở thư mục gốc với nội dung:

```env
# ===== SERVER CONFIG =====
PORT=5000
NODE_ENV=development

# ===== DATABASE =====
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/dermify

# ===== JWT KEYS =====
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your_refresh_secret_key_here
JWT_REFRESH_EXPIRE=30d

# ===== SUPER ADMIN =====
SUPER_ADMIN_EMAIL=admin@dermify.com
SUPER_ADMIN_PASSWORD=your_very_secure_and_unique_password

# ===== CLOUDINARY =====
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# ===== EMAIL - Nodemailer =====
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# ===== EMAIL - SendGrid =====
SENDGRID_API_KEY=your_sendgrid_api_key

# ===== EMAIL - Brevo =====
BREVO_API_KEY=your_brevo_api_key

# ===== FRONTEND URL (for CORS) =====
FRONTEND_URL=http://localhost:3000
```

**Lưu ý**: 
- Tránh commit file `.env` (đã có trong `.gitignore`)
- Sử dụng các khóa API thực tế từ các dịch vụ

### Bước 4: Khởi Động Server

#### Development (có Auto-reload)
```bash
npm run dev
```

#### Production
```bash
npm start
```

#### Production với Biến ENV
```bash
npm run prod
```

### Bước 5: Tạo Dữ Liệu Mẫu (Seed Data)

Server sẽ **tự động tạo Super Admin** khi khởi động.

Để tạo dữ liệu mẫu khác, sử dụng các lệnh sau:

```bash
# Tạo tất cả dữ liệu mẫu
npm run seed

# Tạo chỉ Admin
npm run seed:admin

# Tạo chỉ Nhân viên
npm run seed:staff

# Tạo chỉ Danh mục
npm run seed:category

# Tạo chỉ Sản phẩm
npm run seed:product
```

### Bước 6: Kiểm Tra Server Chạy
```bash
curl http://localhost:5000
# Kết quả: "Dermify API Running..."
```

---

## Tài Khoản Kiểm Thử

### Super Admin (Được Tạo Tự Động)

| Tên | Giá Trị |
|-----|--------|
| **Email** | `admin@dermify.com` (đặt trong `.env`) |
| **Mật khẩu** | (Đặt trong file `.env`) |
| **Quyền** | Quản lý toàn bộ hệ thống (Super Admin) |
| **Lưu ý** | **QUAN TRỌNG**: Luôn đặt một mật khẩu mạnh và duy nhất cho tài khoản Super Admin trong file `.env`. |

### Tài Khoản Kiểm Thử Được Tạo Khi Chạy `npm run seed`

Sau khi chạy `npm run seed`, hệ thống sẽ tạo các tài khoản sau (từ seed files):

| Loại | Email | Mật Khẩu | Quyền |
|------|-------|----------|-------|
| Admin | (từ seed data) | (từ seed data) | admin |
| Staff | (từ seed data) | (từ seed data) | staff |
| Customer | (từ seed data) | (từ seed data) | customer |
| Category | - | - | (Nhiều danh mục được tạo) |
| Product | - | - | (Nhiều sản phẩm được tạo) |

**Xem chi tiết**: Mở các file trong thư mục `src/seeds/` để xem dữ liệu mẫu cụ thể.

### Luồng Đăng Nhập
```
1. POST /api/auth/login
   {
     "email": "admin@dermify.com",
     "password": "your_very_secure_and_unique_password"
   }

2. Nhận lại:
   {
     "success": true,
     "data": {
       "accessToken": "eyJhbGc...",
       "refreshToken": "eyJhbGc...",
       "user": { "id": "...", "email": "...", "role": "super_admin" }
     }
   }

3. Sử dụng accessToken ở header: Authorization: Bearer <accessToken>
```

---

## Phát Triển Tương Lai

### Tính Năng Cần Bổ Sung

#### 1. Hệ Thống Mã Giảm Giá (Coupon)
- Tạo, quản lý mã giảm giá
- Áp dụng mã vào đơn hàng
- Theo dõi số lần sử dụng, hạn sử dụng
- Tính toán giảm giá tự động

#### 2. Thanh Toán Online
- Tích hợp **VNPay** (gateway Việt Nam)
- Tích hợp **Momo** (ví điện tử)
- Tích hợp **Stripe** (thanh toán quốc tế)
- Webhook xác nhận thanh toán từ cổng

#### 3. Thông Báo & Email
- Gửi email xác nhận đơn hàng
- Gửi email cập nhật trạng thái đơn
- Thông báo đơn hàng đã giao
- Nhắc nhở khách về đơn hàng chưa thanh toán
- Hỗ trợ SMS thông báo

#### 4. Quản Lý Kho Hàng (Inventory)
- Theo dõi chi tiết kho theo chi nhánh
- Cảnh báo hết hàng
- Quản lý nhập kho, xuất kho
- Kiểm kê kho định kỳ

#### 5. Lịch Sử Hoạt Động
- Ghi nhật ký thay đổi sản phẩm (ai, khi nào, thay đổi gì)
- Lịch sử cập nhật đơn hàng
- Lịch sử hoạt động người dùng (login, logout, hành động)

#### 6. Báo Cáo & Phân Tích
- Báo cáo doanh số (theo ngày, tuần, tháng, năm)
- Báo cáo sản phẩm bán chạy nhất
- Phân tích thị trường (danh mục nào bán chạy)
- Thống kê khách hàng

#### 7. Giỏ Hàng Cải Tiến
- Lưu giỏ hàng vào session (tạm thời)
- Lưu giỏ hàng vào database (lâu dài)
- Hỗ trợ wishlist (danh sách yêu thích)

#### 8. Tìm Kiếm Nâng Cao
- Full-text search được cải tiến
- Tìm kiếm theo filter phức tạp
- Gợi ý sản phẩm tương tự
- Sản phẩm được xem gần đây

#### 9. Tích Hợp Logistics
- Tính toán phí vận chuyển tự động
- Tích hợp API GHN, GHTK, VTP
- Cập nhật trạng thái vận chuyển real-time
- Lịch sử vận chuyển

#### 10. Bảo Mật & Compliance
- Implement rate limiting (chống brute force)
- Two-factor authentication (2FA)
- Audit log chi tiết
- GDPR compliance
- Mã hóa dữ liệu nhạy cảm

#### 11. Performance Optimization
- Caching (Redis)
- Database indexing tối ưu
- CDN cho hình ảnh
- API versioning (v1, v2, ...)

#### 12. API Documentation
- Swagger/OpenAPI documentation
- Postman collection
- WebSocket cho real-time notifications

---

## Nhóm Phát Triển

| Vai Trò | Thành Viên | GitHub |
|----------|------------|---------|
| Developer | Nguyễn Quốc Tịnh | [@quoctinh-dev](https://github.com/quoctinh-dev) |
| Developer | Nguyễn Thị Kim Tỏa | [@Kimtoa1905](https://github.com/Kimtoa1905) |
| Developer | Nguyễn Toàn | [@nguyentoan2004v-code](https://github.com/nguyentoan2004v-code) |

### Liên Hệ & Hỗ Trợ
- **Repository**: [quoctinhstudy1911-crypto/dermify-server](https://github.com/quoctinhstudy1911-crypto/dermify-server)
- **Issues**: [GitHub Issues](https://github.com/quoctinhstudy1911-crypto/dermify-server/issues)

---

## Ghi Chú Bổ Sung

### API Endpoints
API được chia thành các nhóm chính:
- `/api/auth` - Xác thực
- `/api/customer` - Thông tin khách hàng
- `/api/staff` - Quản lý nhân viên (Admin)
- `/api/products` - Danh sách & chi tiết sản phẩm
- `/api/categories` - Danh mục sản phẩm
- `/api/cart` - Giỏ hàng
- `/api/orders` - Đơn hàng
- `/api/reviews` - Đánh giá & Review
- `/api/users` - Quản lý người dùng (Admin)
- `/api/upload` - Tải ảnh lên

### Mô Hình Bảo Mật
- **JWT**: Xác thực không trạng thái
- **Role-based Access Control (RBAC)**: 4 vai trò (customer, staff, admin, super_admin)
- **Bcrypt**: Hash mật khẩu với salt 10 rounds
- **Soft Delete**: Không xóa dữ liệu vĩnh viễn, chỉ đánh dấu

### Quy Ước Code
- **Naming**: camelCase cho biến/hàm, PascalCase cho class/schema
- **Folder**: Theo module pattern (features dạng folder với controller/service/model/routes)
- **Comments**: Tiếng Việt + Tiếng Anh, giải thích logic phức tạp
- **Error Handling**: Try-catch với custom error messages

---

**Cập nhật lần cuối**: 29/05/2026  
**Phiên bản**: 1.0.0