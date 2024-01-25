const express = require("express");
const { authentication } = require("../../config/Authenticate");
const router = express.Router();
const flatSaleDiscount = require("../../controllers/flashSaleProductDiscount.controller");

// GET FLAT SALE DISCOUNT - ADMIN
router.get("/", flatSaleDiscount.getFlashSaleProductOffer);

// CREATE FLAT SALE DISCOUNT - ADMIN
router.post("/", flatSaleDiscount.createFlashSaleProductOffer);

// DELETE ALL FLAT SALE DISCOUNT -> all - ADMIN
router.delete("/", flatSaleDiscount.deleteAllFlashSaleProductOffer);

// UPDATE FLAT SALE DISCOUNT by ID  - ADMIN
router.put(
    "/inactive/:id",
    flatSaleDiscount.inactiveSingleFlashSaleProductOffer
);

// UPDATE FLAT SALE DISCOUNT by ID  - ADMIN
router.put("/:id", flatSaleDiscount.updateSingleFlashSaleProductOffer);

// GET SINGLE FLAT SALE DISCOUNT BY ID - ADMIN
router.get("/:id", flatSaleDiscount.getSingleFlashSaleProductOffer);

// DELETE SINGLE FLAT SALE DISCOUNT -> by ID  - ADMIN
router.delete("/:id", flatSaleDiscount.deleteSingleFlashSaleProductOffer);

module.exports = router;
