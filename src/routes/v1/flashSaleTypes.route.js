const express = require("express");
const router = express.Router();
const FlashSaleTypeController = require("../../controllers/flashSaleTypes.controller");
// DONE - All blogs - Admin + Client
router.get("/", FlashSaleTypeController.getAllFlashSaleType);
router.post("/", FlashSaleTypeController.createFlashSaleType);
router.post("/delete", FlashSaleTypeController.deleteAllFlashSaleType);
router.get("/:id", FlashSaleTypeController.getSingleFlashSaleType);
router.put("/:id", FlashSaleTypeController.updateSingleFlashSaleType);
router.delete("/:id", FlashSaleTypeController.deleteSingleFlashSaleType);

module.exports = router;
