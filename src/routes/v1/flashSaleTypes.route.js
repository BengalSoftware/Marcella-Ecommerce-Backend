const express = require("express");
const router = express.Router();
const FlashSaleTypeController = require("../../controllers/flashSaleTypes.controller");
const upload = require("../../utils/uploadFiles");

// DONE - All blogs - Admin + Client
router.get("/", FlashSaleTypeController.getAllFlashSaleType);
router.post("/",
    upload.single("image"),
    FlashSaleTypeController.createFlashSaleType);
router.post("/delete", FlashSaleTypeController.deleteAllFlashSaleType);
router.get("/:id", FlashSaleTypeController.getSingleFlashSaleType);
router.put("/:id",
    upload.single("image"),
    FlashSaleTypeController.updateSingleFlashSaleType);
router.delete("/:id", FlashSaleTypeController.deleteSingleFlashSaleType);

module.exports = router;
