const express = require("express");
const { authentication } = require("../../config/Authenticate");
const router = express.Router();
const mobileBannerController = require("../../controllers/mobileBanner.controller");
const upload = require("../../utils/uploadFiles");

// GET ALL DESKTOP BANNER IMAGE -> CLIENT SIDE AND ADMIN
router.get("/", mobileBannerController.getAllMobileBanner);

// POST A SINGLE DESKTOP BANNER IMAGE -> ADMIN
router.post(
  "/",
  authentication,
  upload.single("image"),
  mobileBannerController.postMobileBanner
);

// DELETE A SINGLE DESKTOP BANNER IMAGE -> ADMIN
router.delete(
  "/:id",
  authentication,
  mobileBannerController.deleteSingleMobileBanner
);

module.exports = router;
