const express = require("express");
const { authentication } = require("../../config/Authenticate");
const router = express.Router();
const desktopBannerController = require("../../controllers/desktopBanner.controller");
const upload = require("../../utils/uploadFiles");

// GET ALL DESKTOP BANNER IMAGE -> CLIENT SIDE AND ADMIN
router.get("/", desktopBannerController.getAllDesktopBanner);

router.get("/allBannerName", desktopBannerController.getAllBannerName);

// POST A SINGLE DESKTOP BANNER IMAGE -> ADMIN
router.post(
    "/",
    authentication,
    upload.single("image"),
    desktopBannerController.postDesktopBanner
);

//Update A SINGLE DESKTOP BANNER IMAGE -> ADMIN

router.put(
    "/:id",
    authentication,
    upload.single("image"),
    desktopBannerController.updateDesktopBanner
);

//GET SINGLE DESKTOP BANNER
router.get("/:slug", desktopBannerController.getSingleBanner);

// DELETE A SINGLE DESKTOP BANNER IMAGE -> ADMIN
router.delete(
    "/:id",
    authentication,
    desktopBannerController.deleteSingleDesktopBanner
);

module.exports = router;
