const express = require("express");
const { authentication } = require("../../config/Authenticate");
const subcategoryController = require("../../controllers/subcategory.controller");
const router = express.Router();

// DONE - GET ALL SUBCATEGORIES - ALL
router.get("/", subcategoryController.getSubcategories);

// DONE - GET FILTER SUBCATEGORIES - ALL
router.get("/filter", subcategoryController.getFilterSubcategories);

// GET SUBCATEGORIES by QUERY PARAMS
// router.get('/', subcategoryController.getSubcategoriesByQueryParams);

// POST SINGLE SUBCATEGORY - ADMIN
router.post("/", authentication, subcategoryController.createSubcategory);

// UPDATE MULTIPLE SUBCATEGORIES - ADMIN

// DELETE MULTIPLE SUBCATEGORIES - ADMIN
router.delete(
    "/all",
    authentication,
    subcategoryController.deleteSubcategories
);

// DELETE SINGLE SUBCATEGORY - ADMIN
router.delete("/:id", authentication, subcategoryController.deleteSubcategory);

// UPDATE SINGLE SUBCATEGORY - ADMIN
router.put("/:id", authentication, subcategoryController.updateSubcategory);

// GET SINGLE SUBCATEGORY by ID - ALL
router.get("/:id", subcategoryController.getSubcategory);
module.exports = router;
