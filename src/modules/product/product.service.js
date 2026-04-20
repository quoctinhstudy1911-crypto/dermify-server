const Product = require("./product.model");
const mongoose = require("mongoose")


// <<<LẤY DANH SÁCH SẢN PHẨM (USER SIDE)>>>

const getProductList = async (queryParams) => {
    const { 
        page = 1, 
        limit = 8, 
        search, 
        categoryId, 
        minPrice, 
        maxPrice, 
        sort 
    } = queryParams;

    // 1. Khởi tạo query mặc định (Chỉ lấy SP chưa xóa và đang hoạt động)
    let queryObj = { 
        isDeleted: false, 
        status: "active" 
    };

    // 2. Tìm kiếm Full-text (Nếu Schema đã đánh index text cho name/brand)
    if (search) {
        queryObj.$text = { $search: search };
    }

    // 3. LOGIC QUAN TRỌNG: Lọc theo danh mục
    if (categoryId) {
        // Trường hợp 1: categoryId là mảng [id1, id2...] (Từ logic lấy toàn bộ con)
        if (Array.isArray(categoryId)) {
            queryObj.categoryId = { $in: categoryId };
        } 
        // Trường hợp 2: categoryId là chuỗi cách nhau bởi dấu phẩy "id1,id2"
        else if (typeof categoryId === "string" && categoryId.includes(",")) {
            queryObj.categoryId = { $in: categoryId.split(",") };
        } 
        // Trường hợp 3: Một ID duy nhất
        else {
            queryObj.categoryId = categoryId;
        }
    }

    // 4. Lọc theo khoảng giá
    if (minPrice || maxPrice) {
        queryObj.price = {};
        if (minPrice) queryObj.price.$gte = Number(minPrice);
        if (maxPrice) queryObj.price.$lte = Number(maxPrice);
    }

    // 5. Xử lý Sắp xếp (Sort)
    let sortObj = { createdAt: -1 }; // Mặc định mới nhất lên đầu
    if (sort === "price_asc") sortObj = { price: 1 };
    if (sort === "price_desc") sortObj = { price: -1 };
    if (sort === "rating") sortObj = { ratingAvg: -1 };
    if (sort === "sold") sortObj = { soldCount: -1 };

    // 6. Tính toán Phân trang
    const currentPage = Math.max(1, Number(page));
    const currentLimit = Math.max(1, Number(limit));
    const skip = (currentPage - 1) * currentLimit;

    // 7. Truy vấn Database song song để tăng tốc độ
    const [products, totalProducts] = await Promise.all([
        Product.find(queryObj)
            .select("name slug price originalPrice images ratingAvg soldCount brand stock")
            .sort(sortObj)
            .limit(currentLimit)
            .skip(skip)
            .lean(), // Trả về Plain Object giúp tăng performance
        Product.countDocuments(queryObj)
    ]);

    // 8. Trả về cấu trúc dữ liệu để FE dễ bóc tách
    return {
        products,
        pagination: {
            totalProducts,
            totalPages: Math.ceil(totalProducts / currentLimit),
            currentPage: currentPage,
            limit: currentLimit
        }
    };
};






//  XEM CHI TIẾT SẢN PHẨM (GET PRODUCT DETAIL)

const getProductDetailBySlug = async (slug) => {
    let product;

    if (mongoose.Types.ObjectId.isValid(slug)) {
        // nếu là ID
        product = await Product.findOne({
            _id: slug,
            isDeleted: false,
            status: "active"
        }).populate("categoryId", "name").lean();
    } else {
        // nếu là slug
        product = await Product.findOne({
            slug: slug,
            isDeleted: false,
            status: "active"
        }).populate("categoryId", "name").lean();
    }

    return product;
};






//THÊM SẢN PHẨM MỚI (ADD NEW PRODUCT)

const createProduct = async (productData) => {
    // Hàm .create() sẽ kích hoạt middleware pre('save') trong model để tự động tạo slug
    const newProduct = await Product.create(productData);
    return newProduct;
};






// CẬP NHẬT SẢN PHẨM (UPDATE PRODUCT)

const updateProductById = async (productId, updateData) => {
    // XỬ LÝ CÁI BẪY SLUG: Nếu người dùng có gửi tên mới, phải tự tạo lại slug mới
    if (updateData.name) {
        updateData.slug = updateData.name.toLowerCase()
            .replace(/ /g, "-")
            .replace(/[^\w-]+/g, "");
    }

    // Option { new: true } siêu quan trọng: Yêu cầu Mongoose trả về data SAU KHI SỬA (mặc định nó trả về data cũ)
    // Option { runValidators: true }: Ép Mongoose phải check lại các quy tắc (như price không được để trống)
    const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        updateData,
        { new: true, runValidators: true }
    );

    return updatedProduct;
};






// XÓA SẢN PHẨM (SOFT DELETE)

const deleteProductById = async (productId) => {
    // Không dùng findByIdAndDelete!
    // Chúng ta dùng findByIdAndUpdate để đổi cờ isDeleted thành true, và tiện tay đổi status thành inactive
    const deletedProduct = await Product.findByIdAndUpdate(
        productId,
        { 
            isDeleted: true,
            status: "inactive" 
        },
        { new: true } // Trả về data mới để confirm
    );

    return deletedProduct;
};

module.exports = { 
    getProductList, 
    getProductDetailBySlug,
    createProduct,
    updateProductById,
    deleteProductById
};
