const express = require("express");
const { authentication } = require("../../config/Authenticate");
const userController = require("../../controllers/user.controller");
const upload = require("../../utils/uploadFiles");
const router = express.Router();

// GET ALL ADMINS - ADMIN
router.get("/all", authentication, userController.getAllUsers);

router.get("/totalUsers", authentication, userController.getTotaLUsers);

// GET TOTAL USERS BY MONTH -> ADMIN
router.get(
    "/totalUsersByMonth",
    authentication,
    userController.getTotalUsersByMonth
);

// GET SINGLE USER by Email - USER
router.get("/:email", userController.getUserByEmail);

// delete all  USERS -> ADMIN
router.delete("/all", authentication, userController.deleteAllUsers);

// // CREATE SINGLE USER -
// router.post("/", userController.createUser);

// UPDATE SINGLE USER - CLIENT
router.put(
    "/updateProfile/:email",
    upload.single("photoUrl"),
    userController.updateUser
);

// TODO - UPDATE MULTIPLE USERS

// DELETE SINGLE USER - ADMIN
router.delete("/:id", authentication, userController.deleteUser);

module.exports = router;
