const express = require("express");
const router = express.Router();
const PrivacyPolicyController = require("../../controllers/privacyPolicy.controller");
// DONE - All blogs - Admin + Client
router.get("/", PrivacyPolicyController.getAllPrivacy);
router.post("/", PrivacyPolicyController.createPrivacy);
router.post("/delete", PrivacyPolicyController.deleteAllPrivacy);
router.get("/:id", PrivacyPolicyController.getSinglePrivacy);
router.put("/:id", PrivacyPolicyController.updateSinglePrivacy);
router.delete("/:id", PrivacyPolicyController.deleteSinglePrivacy);

module.exports = router;
