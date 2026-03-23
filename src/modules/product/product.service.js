const Product = require("./product.model");


// <<<LẤY DANH SÁCH SẢN PHẨM (USER SIDE)>>>

const getProductList = async (queryParams) => {
    const { page = 1, limit = 10, search, categoryId, minPrice, maxPrice, sort } = queryParams;

    // Filter cơ bản: Không bị xóa và đang active
    let queryObj = { isDeleted: false, status: "active" };

    // Tìm kiếm Full-text
    if (search) queryObj.$text = { $search: search };

    // Lọc theo danh mục
    if (categoryId) queryObj.categoryId = categoryId;

    // Lọc theo khoảng giá
    if (minPrice || maxPrice) {
        queryObj.price = {};
        if (minPrice) queryObj.price.$gte = Number(minPrice);
        if (maxPrice) queryObj.price.$lte = Number(maxPrice);
    }

    // Xử lý Sort
    let sortObj = { createdAt: -1 };
    if (sort === "price_asc") sortObj = { price: 1 };
    if (sort === "price_desc") sortObj = { price: -1 };
    if (sort === "rating") sortObj = { ratingAvg: -1 };

    const skip = (Number(page) - 1) * Number(limit);

    // Truy vấn song song để tối ưu performance
    const [products, totalProducts] = await Promise.all([
        Product.find(queryObj)
            .select("name slug price originalPrice images ratingAvg soldCount brand")
            .sort(sortObj)
            .limit(Number(limit))
            .skip(skip)
            .lean(),
        Product.countDocuments(queryObj)
    ]);

    return {
        products,
        pagination: {
            totalProducts,
            totalPages: Math.ceil(totalProducts / Number(limit)),
            currentPage: Number(page)
        }
    };
};






//  XEM CHI TIẾT SẢN PHẨM (GET PRODUCT DETAIL)

const getProductDetailBySlug = async (slug) => {
    const product = await Product.findOne({ 
        slug: slug, 
        isDeleted: false, 
        status: "active" 
    })
    .populate("categoryId", "name") // Lấy thêm tên danh mục
    .lean(); // Tăng tốc độ đọc dữ liệu

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
