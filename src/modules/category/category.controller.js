const categoryService = require("./category.service");

// Lấy cây danh mục (Danh mục cha - con lồng nhau)
const categoryService = require("./category.service");

const getCategoryTree = async (req, res, next) => {
  try {
    const tree = await categoryService.getCategoryTree();

    res.status(200).json(tree);
  } catch (error) {
    next(error);
  }
};

// [GET] /api/categories
const getCategories = async (req, res) => {
    try {
        const categories = await categoryService.getCategoryTree();
        
        return res.status(200).json({
            success: true,
            data: categories
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Lỗi hệ thống: " + error.message
        });
    }
};


// [GET] /api/categories/:slug
const getCategoryDetail = async (req, res) => {
    try {
        const { slug } = req.params;
        const category = await categoryService.getCategoryBySlug(slug);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Danh mục không tồn tại hoặc đã bị ẩn!"
            });
        }

        return res.status(200).json({
            success: true,
            data: category
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Lỗi hệ thống: " + error.message
        });
    }
};

// [POST] /api/categories
const createCategory = async (req, res) => {
    try {
        const { name } = req.body;

        // Validation cơ bản
        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Tên danh mục là bắt buộc!"
            });
        }

        // Gọi Service
        const newCategory = await categoryService.createCategory(req.body);

        return res.status(201).json({
            success: true,
            message: "Tạo danh mục thành công!",
            data: newCategory
        });

    } catch (error) {
        // Bắt lỗi trùng tên hoặc trùng slug (Mã 11000 của Mongoose)
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "Tên danh mục này đã tồn tại!"
            });
        }

        return res.status(500).json({
            success: false,
            message: "Lỗi hệ thống: " + error.message
        });
    }
};

// [PUT] /api/categories/:id
const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;

        // Gọi Service thực hiện update
        const updatedCategory = await categoryService.updateCategoryById(id, req.body);

        if (!updatedCategory) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy danh mục cần cập nhật!"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Cập nhật danh mục thành công!",
            data: updatedCategory
        });

    } catch (error) {
        // Vẫn phải bắt lỗi trùng tên
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "Tên danh mục này đã trùng với một danh mục khác!"
            });
        }

        return res.status(500).json({
            success: false,
            message: "Lỗi hệ thống: " + error.message
        });
    }
};

// [DELETE] /api/categories/:id
const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedCategory = await categoryService.deleteCategoryById(id);

        if (!deletedCategory) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy danh mục cần xóa!"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Đã xóa danh mục an toàn!",
            data: {
                _id: deletedCategory._id,
                name: deletedCategory.name,
                isDeleted: deletedCategory.isDeleted
            }
        });

    } catch (error) {
        // Bắt chính xác 2 cái bẫy mìn từ Service quăng lên để chửi Admin
        if (error.message === "HAS_CHILDREN") {
            return res.status(400).json({
                success: false,
                message: "Không thể xóa! Vui lòng xóa hoặc di chuyển các danh mục con trước."
            });
        }

        if (error.message === "HAS_PRODUCTS") {
            return res.status(400).json({
                success: false,
                message: "Không thể xóa! Vui lòng di chuyển tất cả sản phẩm sang danh mục khác trước."
            });
        }

        return res.status(500).json({
            success: false,
            message: "Lỗi hệ thống: " + error.message
        });
    }
};

module.exports = {
     getCategories,
     getCategoryDetail,
     createCategory,
     updateCategory,
     deleteCategory,
     getCategoryTree
     
     };