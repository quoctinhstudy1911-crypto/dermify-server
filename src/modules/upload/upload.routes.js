const express = require("express");
const router = express.Router();

// Lùi 2 cấp (../..) để thoát khỏi thư mục upload và modules, chui vào middleware
const upload = require("../../middleware/upload"); 

// Lùi 2 cấp để chui vào config tìm file cloudinary.js (Tên file config của bạn là gì thì sửa lại nhé, giả sử là cloudinary.js)
const cloudinary = require("../../config/cloudinary"); 

// [POST] /api/upload/images
router.post("/images", upload.array("images", 5), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Vui lòng chọn ít nhất 1 ảnh để upload!"
            });
        }

        const imageUrls = [];

        for (const file of req.files) {
            const result = await cloudinary.uploader.upload(file.path, {
                folder: "ecommerce_products", 
            });
            imageUrls.push(result.secure_url);
        }

        return res.status(200).json({
            success: true,
            message: "Upload ảnh thành công!",
            data: imageUrls 
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Lỗi upload ảnh: " + error.message
        });
    }
});

module.exports = router;