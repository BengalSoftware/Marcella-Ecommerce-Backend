const express = require("express");
const { authentication } = require("../../config/Authenticate");
const router = express.Router();
const sideBannerController = require("../../controllers/sideBanner.controller");
const upload = require("../../utils/uploadFiles");

// GET ALL Top BANNER IMAGE -> CLIENT SIDE AND ADMIN
router.get("/", sideBannerController.getAllSideBanner);

//Update A SINGLE DESKTOP BANNER IMAGE -> ADMIN

router.put(
    "/:id",
    authentication,
    upload.single("image"),
    sideBannerController.updateSideBanner
);

// POST A SINGLE Top BANNER IMAGE -> ADMIN
router.post(
    "/",
    authentication,
    upload.single("image"),
    sideBannerController.postSideBanner
);

// DELETE A SINGLE Top BANNER IMAGE -> ADMIN
router.delete(
    "/:id",
    authentication,
    sideBannerController.deleteSingleSideBanner
);

// DELETE A SINGLE Top BANNER IMAGE -> ADMIN
router.get("/:slug", authentication, sideBannerController.getSingleSideBanner);

module.exports = router;
