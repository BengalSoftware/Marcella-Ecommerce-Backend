const express = require("express");
const router = express.Router();
const reportsController = require("../../controllers/orderReturnReports.controller");

//get all reports by admin
router.get("/", reportsController.getAllReports);

//post  reports by user
router.post("/", reportsController.createReport);

//post  reports by user
router.get("/:id", reportsController.getSingleReport);

//post  reports by user
router.put("/:id", reportsController.updateReport);

//post  reports by user
router.delete("/:id", reportsController.deleteReport);

module.exports = router;
