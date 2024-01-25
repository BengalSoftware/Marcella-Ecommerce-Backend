const express = require("express");
const router = express.Router();
const bottomBannerController = require("../../controllers/bottomBanner.controller");
const upload = require("../../utils/uploadFiles");

// GET ALL bottom BANNER IMAGE -> CLIENT SIDE AND ADMIN
router.get("/", bottomBannerController.getAllBottomBanner);

// POST A SINGLE bottom BANNER IMAGE -> ADMIN
router.post(
    "/",
    upload.single("image"),
    bottomBannerController.postBottomBanner
);
// UPDATE A SINGLE BOTTOM BANNER IMAGE -> ADMIN
router.put(
    "/:id",
    upload.single("image"),
    bottomBannerController.updateBottomBanner
);

// DELETE A SINGLE bottom BANNER IMAGE -> ADMIN
router.delete("/:id", bottomBannerController.deleteSingleBottomBanner);

// GET A SINGLE bottom BANNER IMAGE -> ADMIN
router.get("/:slug", bottomBannerController.getSingleBottomBanner);

module.exports = router;
