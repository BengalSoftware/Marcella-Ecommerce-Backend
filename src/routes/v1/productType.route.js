const express = require("express");
const { authentication } = require("../../config/Authenticate");
const productTypeController = require("../../controllers/productType.controller");
const router = express.Router();
const upload = require("../../utils/uploadFiles");

// DONE - GET ALL PRODUCT TYPE - NONE
router.post("/", authentication, productTypeController.AddProductType);
router.get("/", productTypeController.getAllProductType);
router.get("/:id", authentication, productTypeController.getSingleProductType);
router.put("/:id", authentication, productTypeController.updateProductType);
router.delete("/:id", authentication, productTypeController.deleteProductType);


module.exports = router;
