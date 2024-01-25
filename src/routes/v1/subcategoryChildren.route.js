const express = require("express");
const { authentication } = require("../../config/Authenticate");
const subcategoryChildrenController = require("../../controllers/subcategoryChildren.controller");
const upload = require("../../utils/uploadFiles");
const router = express.Router();

// DONE - GET ALL SUBCATEGORIES CHILDREN - ALL
router.get("/", subcategoryChildrenController.getSubcategoryChildren);

// DONE - GET ALL SUBCATEGORIES CHILDREN - ALL
router.get(
    "/filter",
    subcategoryChildrenController.getFilterSubcategoryChildren
);

// DONE - GET ALL SUBCATEGORIES CHILDREN - ALL
router.get("/limit", subcategoryChildrenController.getSubCategoriesByPage);

// DONE - GET ALL NICHE CATEGORY CHILDREN - ALL
router.get("/nicheCategory", subcategoryChildrenController.getAllNicheCategory);

// POST SINGLE SUBCATEGORY CHILDREN - ADMIN
router.post(
    "/",
    authentication,
    upload.single("image"),
    subcategoryChildrenController.createSubcategoryChild
);

// DELETE MULTIPLE SUBCATEGORIES CHILDREN - ADMIN
router.delete(
    "/all",
    authentication,
    subcategoryChildrenController.deleteSubcategoryChildren
);

// UPDATE SINGLE SUBCATEGORY CHILDREN - ADMIN
router.put(
    "/:id",
    authentication,
    upload.single("image"),
    subcategoryChildrenController.updateSubcategoryChild
);

// GET SINGLE SUBCATEGORY CHILDREN  by ID - ALL
router.get("/:id", subcategoryChildrenController.getSubcategoryChild);

// DELETE SINGLE SUBCATEGORY CHILDREN - ADMIN
router.delete(
    "/:id",
    authentication,
    subcategoryChildrenController.deleteSubcategoryChild
);

module.exports = router;
