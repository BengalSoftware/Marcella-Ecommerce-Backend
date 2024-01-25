const express = require('express');
const { authentication } = require('../../config/Authenticate');
const manufacturerController = require('../../controllers/manufacturer.controller');
const router = express.Router();

// DONE - GET ALL MANUFACTURERS - NONE
router.get('/', manufacturerController.getManufacturers);

// DONE - GET SINGLE MANUFACTURER by ID - NONE
router.get('/:id', manufacturerController.getManufacturer);

// GET MANUFACTURERS by QUERY PARAMS
// router.get('/',);

// DONE - CREATE SINGLE MANUFACTURER - ADMIN
router.post('/', authentication, manufacturerController.createManufacturer);

// CREATE MULTIPLE MANUFACTURER
// router.post('/all',);

// DONE - UPDATE SINGLE MANUFACTURER - ADMIN
router.put('/:id', authentication, manufacturerController.updateManufacturer);

// UPDATE MULTIPLE MANUFACTURERS - ADMIN

// DELETE MULTIPLE MANUFACTURERS - ADMIN
router.delete('/all', authentication, manufacturerController.deleteManufacturers);

// DONE - DELETE SINGLE MANUFACTURERS - ADMIN
router.delete('/:id', authentication, manufacturerController.deleteManufacturer);

module.exports = router;
