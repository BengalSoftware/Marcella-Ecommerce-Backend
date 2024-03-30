const express = require("express");
const { authentication } = require("../../config/Authenticate");
const router = express.Router();
const newUserDiscount = require("../../controllers/newUserDiscount.controller");

// GET NEW USER DISCOUNT - ADMIN
router.get("/", newUserDiscount.getNewUserDiscount);

// CREATE NEW USER DISCOUNT - ADMIN
router.post("/", newUserDiscount.createNewUserDiscount);

// DELETE ALL NEW USER DISCOUNT -> all - ADMIN
router.delete("/", newUserDiscount.deleteAllNewUserDiscount);

// GET SINGLE NEW USER DISCOUNT BY ID - ADMIN
router.get("/:id", newUserDiscount.getSingleNewUserDiscount);

// UPDATE NEW USER DISCOUNT by ID  - ADMIN
router.put("/:id", newUserDiscount.updateSingleNewUserDiscount);

// DELETE SINGLE NEW USER DISCOUNT -> by ID  - ADMIN
router.delete("/:id", newUserDiscount.deleteSingleNewUserDiscount);

module.exports = router;
