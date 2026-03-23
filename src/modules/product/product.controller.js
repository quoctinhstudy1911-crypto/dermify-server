const productService = require("./product.service");

//  XEM CHI TIẾT SẢN PHẨM (GET PRODUCT DETAIL)

const getProducts = async (req, res) => {
    try {
        const result = await productService.getProductList(req.query);
        return res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Lỗi hệ thống: " + error.message
        });
    }
};






//  XEM CHI TIẾT SẢN PHẨM (GET PRODUCT DETAIL)

const getProductDetail = async (req, res) => {
    try {
        const { slug } = req.params;
        const product = await productService.getProductDetailBySlug(slug);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Sản phẩm không tồn tại hoặc đã bị ẩn."
            });
        }

        return res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Lỗi hệ thống: " + error.message
        });
    }
};







//THÊM SẢN PHẨM MỚI (ADD NEW PRODUCT)

const createProduct = async (req, res) => {
    try {
        const { name, price } = req.body;

        // 1. Validation cơ bản (Bảo vệ Database)
        if (!name || !price) {
            return res.status(400).json({
                success: false,
                message: "Tên sản phẩm và giá là thông tin bắt buộc!"
            });
        }

        // 2. Gọi service tạo sản phẩm
        const newProduct = await productService.createProduct(req.body);

        // 3. Trả về kết quả (Dùng status 201 cho hành động Create)
        return res.status(201).json({
            success: true,
            message: "Thêm sản phẩm thành công!",
            data: newProduct
        });

    } catch (error) {
        // Xử lý lỗi trùng unique key (Mã lỗi 11000 của MongoDB)
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "Tên sản phẩm này đã tồn tại trong hệ thống!"
            });
        }
        
        return res.status(500).json({
            success: false,
            message: "Lỗi hệ thống: " + error.message
        });
    }
};






// CẬP NHẬT SẢN PHẨM (UPDATE PRODUCT)

const updateProduct = async (req, res) => {
    try {
        const { id } = req.params; // Lấy ID từ trên URL xuống
        
        // Gọi Service để update
        const updatedProduct = await productService.updateProductById(id, req.body);

        // Trường hợp gõ sai ID hoặc sản phẩm đã bị xóa
        if (!updatedProduct) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy sản phẩm cần cập nhật!"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Cập nhật sản phẩm thành công!",
            data: updatedProduct
        });

    } catch (error) {
        // Vẫn phải bắt lỗi trùng tên nếu họ đổi tên trùng với sản phẩm khác
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "Tên sản phẩm này đã trùng với một sản phẩm khác!"
            });
        }
        return res.status(500).json({
            success: false,
            message: "Lỗi hệ thống: " + error.message
        });
    }
};





// XÓA SẢN PHẨM (SOFT DELETE)

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Gọi Service thực hiện xóa mềm
        const deletedProduct = await productService.deleteProductById(id);

        if (!deletedProduct) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy sản phẩm cần xóa!"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Sản phẩm đã được chuyển vào thùng rác (Soft Delete)!",
            // Bạn có thể không cần trả về data, hoặc trả về để Frontend confirm
            data: {
                _id: deletedProduct._id,
                name: deletedProduct.name,
                isDeleted: deletedProduct.isDeleted
            }
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Lỗi hệ thống: " + error.message
        });
    }
};


module.exports = { 
    getProducts, 
    getProductDetail,
    createProduct,
    updateProduct,
    deleteProduct
};