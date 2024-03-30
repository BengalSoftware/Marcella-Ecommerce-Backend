const express = require("express");
const router = express.Router();
const Footer = require("../../controllers/footer.controller");
// DONE - All blogs - Admin + Client
router.get("/", Footer.getAllFooter);
router.post("/", Footer.createFooter);
router.post("/delete", Footer.deleteAllFooter);
router.get("/:id", Footer.getSingleFooter);
router.put("/:id", Footer.updateSingleFooter);
router.delete("/:id", Footer.deleteSingleFooter);

module.exports = router;
