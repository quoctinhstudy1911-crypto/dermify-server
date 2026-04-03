const mongoose = require("mongoose");
const Category = require("./category.model"); // Nhớ trỏ đúng đường dẫn tới file model của bạn
const Product = require("../product/product.model");

// Lấy cây danh mục (Danh mục cha - con lồng nhau)
const getCategoryTree = async () => {
    // 1. Lấy tất cả danh mục chưa bị xóa và đang active
    const categories = await Category.find({ isDeleted: false, status: "active" })
        .select("_id name slug parentId level path status")
        // Mẹo Senior: Sort theo level tăng dần đảm bảo Danh mục cha luôn được query ra trước con
        .sort({ level: 1, createdAt: 1 }) 
        .lean();

    // 2. Thuật toán O(N) ráp Cây (Biến mảng phẳng thành cây lồng nhau)
    const categoryMap = {};
    const tree = [];

    // Bước 2.1: Khởi tạo cuốn từ điển (Map), mồi sẵn mảng children rỗng cho mỗi node
    categories.forEach(cat => {
        // Dùng .toString() để đảm bảo ObjectId biến thành chuỗi chuẩn xác khi làm key
        categoryMap[cat._id.toString()] = { ...cat, children: [] };
    });

    // Bước 2.2: Lắp ráp con vào cha
    categories.forEach(cat => {
        if (cat.parentId) {
            const parentIdStr = cat.parentId.toString();
            // Nếu tìm thấy cha trong từ điển -> Nhét thằng con này vào bụng (children) của cha
            if (categoryMap[parentIdStr]) {
                categoryMap[parentIdStr].children.push(categoryMap[cat._id.toString()]);
            }
        } else {
            // Nếu parentId = null -> Đây là danh mục Gốc (Level 0) -> Nhét thẳng vào mảng kết quả
            tree.push(categoryMap[cat._id.toString()]);
        }
    });

    return tree;
};

// Lấy chi tiết danh mục theo Slug
const getCategoryBySlug = async (slug) => {
    const category = await Category.findOne({ 
        slug: slug, 
        isDeleted: false, 
        status: "active" 
    })
    .populate("parentId", "name slug") // Tinh tế ở đây: Lấy luôn tên và slug của thằng Cha (nếu có)
    .lean();

    return category;
};


// Tạo mới danh mục
const createCategory = async (categoryData) => {
    const { name, parentId, status } = categoryData;

    // 1. Tạo sẵn 1 cái ID duy nhất cho danh mục mới này
    const newCategoryId = new mongoose.Types.ObjectId();
    
    // Mặc định: Coi như nó là Gốc (Root)
    let level = 0;
    let path = newCategoryId.toString();

    // 2. Nếu Admin truyền parentId vào (Tức là nó làm Con)
    if (parentId) {
        // Đi tìm người Cha
        const parentCategory = await Category.findById(parentId);
        if (!parentCategory) {
            throw new Error("Danh mục cha không tồn tại!");
        }

        // 3. Kế thừa và cộng dồn: Level con = Level cha + 1
        level = parentCategory.level + 1;
        
        // Nối 'path' của cha với ID của con (Ví dụ: idÔng/idCha/idCon)
        path = `${parentCategory.path}/${newCategoryId.toString()}`;
    }

    // 4. Tạo và Lưu vào DB
    const newCategory = new Category({
        _id: newCategoryId,
        name,
        parentId: parentId || null,
        level,
        path,
        status
    });

    // Hàm .save() sẽ tự động kích hoạt cái pre("save") trong Model để đẻ ra 'slug'
    await newCategory.save();

    return newCategory;
};

// Cập nhật danh mục (Chỉ cho phép đổi tên và status, KHÔNG cho đổi parentId qua API này)
const updateCategoryById = async (categoryId, updateData) => {
    // 1. BẢO VỆ CẤU TRÚC CÂY: Tuyệt đối không cho phép sửa parentId qua API này
    if (updateData.parentId !== undefined) {
        delete updateData.parentId; // Xóa sổ luôn, coi như Admin chưa từng gửi lên
    }

    // 2. BẪY SLUG (Giống Product): Nếu Admin đổi tên, tự động làm lại slug mới
    if (updateData.name) {
        updateData.slug = updateData.name.toLowerCase()
            .replace(/ /g, "-")
            .replace(/[^\w-]+/g, "");
    }

    // 3. Tiến hành cập nhật
    const updatedCategory = await Category.findByIdAndUpdate(
        categoryId,
        updateData,
        { new: true, runValidators: true }
    );

    return updatedCategory;
};

// Xóa danh mục (Soft Delete)
const deleteCategoryById = async (categoryId) => {
    // DÒ MÌN 1: Kiểm tra xem có danh mục con nào đang bám theo nó không?
    const hasChildren = await Category.exists({ 
        parentId: categoryId, 
        isDeleted: false 
    });
    
    if (hasChildren) {
        throw new Error("HAS_CHILDREN"); // Quăng mã lỗi riêng để Controller dễ bắt
    }

    // DÒ MÌN 2: Kiểm tra xem có sản phẩm nào đang nằm trong danh mục này không?
    
    const hasProducts = await Product.exists({ categoryId: categoryId, isDeleted: false });
    if (hasProducts) {
        throw new Error("HAS_PRODUCTS");
    }
    

    // NẾU AN TOÀN: Tiến hành Xóa mềm (Soft Delete)
    const deletedCategory = await Category.findByIdAndUpdate(
        categoryId,
        { 
            isDeleted: true, 
            status: "hidden" 
        },
        { new: true }
    );

    return deletedCategory;
};

module.exports = {
     getCategoryTree ,
     getCategoryBySlug,
     createCategory,
     updateCategoryById,
     deleteCategoryById
    };