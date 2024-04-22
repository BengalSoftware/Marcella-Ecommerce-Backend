const express = require("express");
const router = express.Router();
const storeLayoutController = require("../../controllers/storelayout.controller");


const upload = require("../../utils/uploadFiles");
// DONE - All blogs - Admin + Client
router.post("/:email",
    upload.array("images", 3),
    storeLayoutController.createStoreLayout);

router.put("/:id",
    upload.array("images", 3),
    storeLayoutController.updateStoreLayout);

router.get("/:email",
    storeLayoutController.getStoreLayout);


module.exports = router;
