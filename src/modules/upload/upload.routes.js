const express = require("express");
const router = express.Router();
const fs = require("fs"); // Thêm để dọn dẹp file tạm
const upload = require("../../middleware/upload"); 
const cloudinary = require("../../config/cloudinary"); 

// [POST] /api/upload/images
router.post("/images", upload.array("images", 5), async (req, res) => {
    try {
        // Kiểm tra nếu không có file
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Vui lòng chọn ít nhất 1 ảnh để upload!"
            });
        }

        const imageUrls = [];

        // Sử dụng for...of để xử lý từng ảnh một cách tuần tự
        for (const file of req.files) {
            try {
                const result = await cloudinary.uploader.upload(file.path, {
                    folder: "ecommerce_products", 
                });
                
                imageUrls.push(result.secure_url);

                // QUAN TRỌNG: Dọn dẹp file tạm sau khi upload thành công
                if (fs.existsSync(file.path)) {
                    fs.unlinkSync(file.path);
                }
            } catch (uploadErr) {
                // Nếu 1 ảnh lỗi, vẫn nên xóa file tạm của ảnh đó để tránh rác server
                if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
                console.error("Lỗi từng ảnh:", uploadErr);
            }
        }

        return res.status(200).json({
            success: true,
            message: `Upload thành công ${imageUrls.length} ảnh!`,
            data: imageUrls 
        });

    } catch (error) {
        // Nếu có lỗi tổng thể, cố gắng dọn dẹp tất cả file tạm còn sót lại
        if (req.files) {
            req.files.forEach(file => {
                if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
            });
        }

        return res.status(500).json({
            success: false,
            message: "Lỗi upload ảnh: " + error.message
        });
    }
});

module.exports = router;