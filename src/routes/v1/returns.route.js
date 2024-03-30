const express = require("express");
const router = express.Router();
const ReturnsController = require("../../controllers/returns.controller");
// DONE - All blogs - Admin + Client
router.get("/", ReturnsController.getAllReturns);
router.post("/", ReturnsController.createReturn);
router.post("/delete", ReturnsController.deleteAllReturns);
router.get("/:id", ReturnsController.getSingleReturn);
router.put("/:id", ReturnsController.updateSingleReturn);
router.delete("/:id", ReturnsController.deleteSingleReturn);

module.exports = router;
