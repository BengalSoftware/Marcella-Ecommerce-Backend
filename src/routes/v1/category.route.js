const express = require("express");
const { authentication } = require("../../config/Authenticate");
const categoryController = require("../../controllers/category.controller");
const router = express.Router();
const upload = require("../../utils/uploadFiles");

// DONE - GET ALL CATEGORIES - NONE
router.get("/", categoryController.getCategories);

// DONE - GET ALL CATEGORIES - NONE
router.get("/breadcrumb", categoryController.getBreadcrumbCategory);

// DONE - POST SINGLE CATEGORY - ADMIN
router.post("/", authentication, categoryController.createCategory);

// TODO - UPDATE MULTIPLE CATEGORY - ADMIN

// DONE - DELETE ALL CATEGORIES - ADMIN
router.delete("/all", authentication, categoryController.deleteCategories);

// DONE - DELETE SINGLE CATEGORY - ADMIN
router.delete("/:id", authentication, categoryController.deleteCategory);

// DONE - GET SINGLE CATEGORY by ID - NONE
router.get("/:id", categoryController.getCategory);

// DONE - UPDATE SINGLE CATEGORY - ADMIN
router.put("/:id", authentication, categoryController.updateCategory);
// DONE - UPDATE SINGLE CATEGORY - ADMIN
router.get("/description/:category", categoryController.getAnyCategoriesWithSlug);

module.exports = router;
