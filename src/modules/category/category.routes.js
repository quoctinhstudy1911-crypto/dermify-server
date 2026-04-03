const express = require("express");
const router = express.Router();
const categoryController = require("./category.controller");
const authMiddleware = require("../../middleware/authMiddleware"); 
const requireRole = require("../../middleware/requireRole");

// PUBLIC APIS
// LẤY DANH SÁCH DANH MỤC (PUBLIC)
router.get("/", categoryController.getCategories);
router.get("/tree", categoryController.getCategoryTree);
//  XEM CHI TIẾT DANH MỤC (Public)
router.get("/:slug", categoryController.getCategoryDetail);

// PROTECTED APIS (Chỉ Admin & Super Admin)
//  THÊM MỚI DANH MỤC (Cần phân quyền Admin sau)
router.post("/", 
    authMiddleware, 
    requireRole("admin", "super_admin"), 
    categoryController.createCategory
);
//  CẬP NHẬT DANH MỤC
router.put("/:id", 
    authMiddleware, 
    requireRole("admin", "super_admin"), 
    categoryController.updateCategory
);
//  XÓA DANH MỤC (Kèm check ràng buộc)
router.delete("/:id", 
    authMiddleware, 
    requireRole("admin", "super_admin"), 
    categoryController.deleteCategory
);
module.exports = router;