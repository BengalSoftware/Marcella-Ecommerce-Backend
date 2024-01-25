const express = require("express");
const router = express.Router();
const TermsConditionsController = require("../../controllers/terms&condition.controller");
// DONE - All blogs - Admin + Client
router.get("/", TermsConditionsController.getAllTerms);
router.post("/", TermsConditionsController.createTerm);
router.post("/delete", TermsConditionsController.deleteAllTerms);
router.get("/:id", TermsConditionsController.getSingleTerm);
router.put("/:id", TermsConditionsController.updateSingleTerm);
router.delete("/:id", TermsConditionsController.deleteSingleTerm);

module.exports = router;
