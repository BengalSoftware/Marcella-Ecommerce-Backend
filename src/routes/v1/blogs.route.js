const express = require("express");
const router = express.Router();
const blogsController = require("../../controllers/blogs.controller");
const { authentication } = require("../../config/Authenticate");
const upload = require("../../utils/uploadFiles");

// DONE - All blogs - Admin + Client
router.get("/", blogsController.getAllBlogs);

// DONE - All blogs - Admin + Client
router.get("/recent", blogsController.getRecentBlogs);

//CREATE NEW BLOG - ADMIN
router.post(
    "/",
    authentication,
    upload.single("image"),
    blogsController.createBlogs
);

// DELETE ALL BLOG ADMIN
router.delete("/deleteAll", blogsController.deleteAllBlogs);

// GET BLOG -> Admin
router.get("/:id", blogsController.getSingleBlog);

// GET BLOG => Client
router.get("/single/:slug", blogsController.getSingleBlogByName);

// UPDATE BLOG ADMIN
router.put(
    "/:id",
    authentication,
    upload.single("image"),
    blogsController.updateSingleBlog
);

router.delete("/:id", blogsController.deleteSingleBlog);

module.exports = router;
