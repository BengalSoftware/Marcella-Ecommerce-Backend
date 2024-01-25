const express = require("express");
const { authentication } = require("../../config/Authenticate");
const router = express.Router();
const RelatedBannerController = require("../../controllers/relatedBanner.controller");
const upload = require("../../utils/uploadFiles");

// GET ALL Top BANNER IMAGE -> CLIENT Related AND ADMIN
router.get("/", RelatedBannerController.getAllRelatedBanner);

//Update A SINGLE DESKTOP BANNER IMAGE -> ADMIN

router.put(
    "/:id",
    authentication,
    upload.single("image"),
    RelatedBannerController.updateRelatedBanner
);

// POST A SINGLE Top BANNER IMAGE -> ADMIN
router.post(
    "/",
    authentication,
    upload.single("image"),
    RelatedBannerController.postRelatedBanner
);

// DELETE A SINGLE Top BANNER IMAGE -> ADMIN
router.delete(
    "/:id",
    authentication,
    RelatedBannerController.deleteSingleRelatedBanner
);

// GET A SINGLE Top BANNER IMAGE -> ADMIN
router.get(
    "/:slug",
    authentication,
    RelatedBannerController.getSingleRelatedBanner
);

module.exports = router;
