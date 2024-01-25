const express = require("express");
const { authentication } = require("../../config/Authenticate");
const rulesController = require("../../controllers/rules.controller");
const router = express.Router();
const upload = require("../../utils/uploadFiles");

// DONE - GET ALL CATEGORIES - NONE
router.get("/", rulesController.getRules);

// DONE - POST SINGLE CATEGORY - ADMIN
router.post(
    "/",
    authentication,
    upload.single("image"),
    rulesController.createRule
);

// TODO - UPDATE MULTIPLE CATEGORY - ADMIN

// DONE - DELETE ALL CATEGORIES - ADMIN
router.delete("/all", authentication, rulesController.deleteRules);

// DONE - DELETE SINGLE CATEGORY - ADMIN
router.delete("/:id", authentication, rulesController.deleteRule);

// DONE - GET SINGLE CATEGORY by ID - NONE
router.get("/:id", rulesController.getRule);

// DONE - UPDATE SINGLE CATEGORY - ADMIN
router.put(
    "/:id",
    authentication,
    upload.single("image"),
    rulesController.updateRule
);

module.exports = router;
