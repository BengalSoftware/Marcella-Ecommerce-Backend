const express = require("express");
const router = express.Router();
const storeLayoutController = require("../../controllers/storelayout.controller");


const upload = require("../../utils/uploadFiles");
// DONE - All blogs - Admin + Client
router.post("/:email",
    upload.array("images", 2),
    storeLayoutController.createStoreLayout);

router.get("/:email",
    storeLayoutController.getStoreLayout);


module.exports = router;
