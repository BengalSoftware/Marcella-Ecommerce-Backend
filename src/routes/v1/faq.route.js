const express = require("express");
const router = express.Router();
const faqController = require("../../controllers/faq.controller");

// DONE - All Faq - Admin + Client
router.get("/", faqController.getAllFaq);
router.post("/", faqController.createFaq);
router.delete("/deleteAll", faqController.deleteAllFaq);
router.get("/:id", faqController.getSingleFaq);
router.put("/:id", faqController.updateSingleBlog);
router.delete("/:id", faqController.deleteSingleFaq);

module.exports = router;
