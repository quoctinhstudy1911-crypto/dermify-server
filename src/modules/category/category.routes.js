const express = require("express");
const router = express.Router();
const categoryController = require("./category.controller");

// LẤY DANH SÁCH DANH MỤC (PUBLIC)
router.get("/", categoryController.getCategories);
// STEP 2: XEM CHI TIẾT DANH MỤC (Public)
router.get("/:slug", categoryController.getCategoryDetail);
// STEP 3: THÊM MỚI DANH MỤC (Cần phân quyền Admin sau)
router.post("/", categoryController.createCategory);
// STEP 4: CẬP NHẬT DANH MỤC
router.put("/:id", categoryController.updateCategory);
// STEP 5: XÓA DANH MỤC (Kèm check ràng buộc)
router.delete("/:id", categoryController.deleteCategory);
module.exports = router;