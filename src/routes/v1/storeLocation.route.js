const express = require("express");
const router = express.Router();
const StoreLocationController = require("../../controllers/storeLocation.controller");
// DONE - All blogs - Admin + Client
router.get("/", StoreLocationController.getAllStoreLocation);
router.post("/", StoreLocationController.createStoreLocation);
router.post("/delete", StoreLocationController.deleteAllStoreLocation);
router.get("/:id", StoreLocationController.getSingleStoreLocation);
router.put("/:id", StoreLocationController.updateSingleStoreLocation);
router.delete("/:id", StoreLocationController.deleteSingleStoreLocation);

module.exports = router;
