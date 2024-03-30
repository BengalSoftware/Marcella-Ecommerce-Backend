const express = require("express");
const router = express.Router();
const ColorController = require("../../controllers/color.controller");
// DONE - All blogs - Admin + Client
router.get("/", ColorController.getAllColor);
router.post("/", ColorController.createColor);
router.post("/delete", ColorController.deleteAllColor);
router.get("/:id", ColorController.getSingleColor);
router.put("/:id", ColorController.updateSingleColor);
router.delete("/:id", ColorController.deleteSingleColor);

module.exports = router;
