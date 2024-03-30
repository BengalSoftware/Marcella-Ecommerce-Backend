const express = require("express");
const router = express.Router();
const NewsLetterController = require("../../controllers/newsLetter.controller");
// DONE - All blogs - Admin + Client
router.get("/", NewsLetterController.getAllNewsLetter);
router.post("/", NewsLetterController.subscribeNewsLetter);
router.post("/delete", NewsLetterController.deleteAllNewsLetter);
router.get("/:id", NewsLetterController.getSingleNewsLetter);
router.delete("/:id", NewsLetterController.deleteSingleNewsLetter);

module.exports = router;
