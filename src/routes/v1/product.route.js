const express = require("express");
const router = express.Router();
const { authentication } = require("../../config/Authenticate");
const productController = require("../../controllers/product.controller");
const upload = require("../../utils/uploadFiles");

// DONE - GET ALL PRODUCTS - NONE
router.get("/", productController.getProducts);

// Client side home page all products
router.get("/all", productController.getAllProducts);

// Client side home page all products
router.post("/searchSuggestion", productController.getSearchSuggestion);

// GET ALL FLASH PRODUCTS ADMIN
router.get("/flashProduct", productController.getFlashProductsAdmin);

// GET ACTIVE ALL Flash products -> CLIENT
router.get("/flashProduct/all", productController.getAllFlashProducts);

// GET SIX ACTIVE FLASH PRODUCTS -> CLIENT
router.get("/flashProduct/six", productController.getSixFlashProducts);

// DONE - GET PRODUCTS by PRODUCT TYPE - NONE
router.get(
    "/productType/:productType",
    productController.getProductByProductType
);

router.get(
    "/gallery-images",
    productController.getProductImages
);

router.get(
    "/campaignProducts/:campaignId",
    productController.getCampaignProducts
);

// DONE - GET PRODUCTS by PRODUCT TYPE - NONE
router.get(
    "/low-quantity",
    authentication,
    productController.getLowQuantityProducts
);

// DONE - GET PRODUCTS by PRODUCT CATEGORY - NONE
router.get("/category/:category", productController.getProductsByCategory);

// DONE - GET PRODUCTS by PRODUCT CATEGORY - NONE
router.get(
    "/related-products/:name",
    productController.getRelatedProductsByProductId
);

// DONE - GET PRODUCTS by PRODUCT CATEGORY - NONE
router.get("/brand-products/:id", productController.getProductsByBrandId);

// DONE - GET PRODUCTS by PRODUCT CATEGORY - NONE
router.get("/seller-products/:id", productController.getProductsBySellerId);

// CREATE SINGLE PRODUCT - ADMIN
router.post(
    "/",
    // authentication,
    upload.array("images", 5),
    productController.createProduct
);

// DONE - GET SINGLE PRODUCT by ID - ADMIN
router.get("/admin/:id", productController.getProductAdmin);

// DONE - GET SINGLE PRODUCT by ID - CLIENT
router.get("/:name", productController.getProduct);

// DONE - UPDATE SINGLE PRODUCT - ADMIN
router.put(
    "/:id",
    upload.array("images", 5),
    productController.updateProduct
);

// DONE - DELETE ALL PRODUCTS - ADMIN
router.delete("/all", productController.deleteProducts);

// DONE - DELETE SINGLE PRODUCT - ADMIN
router.delete("/:id", authentication, productController.deleteProduct);

module.exports = router;
