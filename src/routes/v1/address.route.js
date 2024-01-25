const express = require("express");
const { authentication } = require("../../config/Authenticate");
const addressController = require("../../controllers/address.controller");
const router = express.Router();

// GET ALL ADDRESSES - ADMIN
router.get("/all", authentication, addressController.getAddresses);

// CREATE SINGLE ADDRESS - CLIENT
router.post("/:email", addressController.createAddress);

// GET SINGLE ADDRESS by ID - ALL
router.get("/all/:email", addressController.getAddress);

//  GET SINGLE ADDRESS BY ID - CLIENT
router.get("/:addressId", addressController.getAddressById);

// UPDATE SINGLE ADDRESS
router.put("/:addressId", addressController.updateAddress);

// Active ADDRESS get -> client
router.get("/active/:email", addressController.getActiveAddress);

// Active SINGLE ADDRESS
router.put("/active/:userId", addressController.activeAddress);

// USER - UPDATE SINGLE ADDRESS
// router.put('/:email', addressController.updateAddressByUserEmail);

// DELETE SINGLE ADDRESS - NONE
router.delete("/:email", addressController.deleteAddressById);

module.exports = router;
