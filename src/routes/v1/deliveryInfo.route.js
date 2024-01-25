const express = require("express");
const router = express.Router();
const DeliverInfoController = require("../../controllers/deliverInfo.controller");
// DONE - All blogs - Admin + Client
router.get("/", DeliverInfoController.getAllDeliverInfo);
router.post("/", DeliverInfoController.createDeliverInfo);
router.post("/delete", DeliverInfoController.deleteAllDeliverInfo);
router.get("/:id", DeliverInfoController.getSingleDeliverInfo);
router.put("/:id", DeliverInfoController.updateSingleDeliverInfo);
router.delete("/:id", DeliverInfoController.deleteSingleDeliverInfo);

module.exports = router;
