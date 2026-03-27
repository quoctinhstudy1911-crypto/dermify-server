const express = require("express");
const router = express.Router();
const productController = require("./product.controller");

//  XEM CHI TIẾT SẢN PHẨM (GET PRODUCT DETAIL)
router.get("/", productController.getProducts);
//  XEM CHI TIẾT SẢN PHẨM (GET PRODUCT DETAIL)
router.get("/:slug", productController.getProductDetail);
//THÊM SẢN PHẨM MỚI (ADD NEW PRODUCT)
router.post("/", productController.createProduct);
//CẬP NHẬT SẢN PHẨM (UPDATE PRODUCT)
router.put("/:id", productController.updateProduct);
//XÓA SẢN PHẨM (DELETE PRODUCT)
router.delete("/:id", productController.deleteProduct);
module.exports = router;