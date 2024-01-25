const express = require("express");
const router = express.Router();
const SizeController = require("../../controllers/size.controller");
// DONE - All blogs - Admin + Client
router.get("/", SizeController.getAllSize);
router.post("/", SizeController.createSize);
router.post("/delete", SizeController.deleteAllSize);
router.get("/:id", SizeController.getSingleSize);
router.put("/:id", SizeController.updateSingleSize);
router.delete("/:id", SizeController.deleteSingleSize);

module.exports = router;
