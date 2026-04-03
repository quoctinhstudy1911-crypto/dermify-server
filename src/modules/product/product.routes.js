const express = require("express");
const router = express.Router();
const productController = require("./product.controller");

const authMiddleware = require("../../middleware/authMiddleware"); 
const requireRole = require("../../middleware/requireRole");

// PUBLIC APIS
//  XEM CHI TIẾT SẢN PHẨM (GET PRODUCT DETAIL)
router.get("/", productController.getProducts);
//  XEM CHI TIẾT SẢN PHẨM (GET PRODUCT DETAIL)
router.get("/:slug", productController.getProductDetail);

// PROTECTED APIS
//THÊM SẢN PHẨM MỚI (ADD NEW PRODUCT)
router.post("/", 
    authMiddleware, 
    requireRole("admin", "super_admin"), 
    productController.createProduct
);
//CẬP NHẬT SẢN PHẨM (UPDATE PRODUCT)
router.put("/:id", 
    authMiddleware, 
    requireRole("admin", "super_admin"), 
    productController.updateProduct
);
//XÓA SẢN PHẨM (DELETE PRODUCT)
router.delete("/:id", 
    authMiddleware, 
    requireRole("admin", "super_admin"), 
    productController.deleteProduct
);
module.exports = router;