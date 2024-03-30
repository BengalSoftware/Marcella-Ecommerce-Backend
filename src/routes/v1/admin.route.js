const express = require("express");
const { authentication } = require("../../config/Authenticate");
const {
    login,
    register,
    allAdmin,
    getAdminInfoByEmail,
    updateAndPasswordChange,
    deleteAdmin,
    addManager,
    getAllManger,
    updateAdminPassword,
} = require("../../controllers/admin.controller");
const router = express.Router();

// ADMIN
router.get("/allAdmin", authentication, allAdmin);

// ADMIN
router.get("/:id", getAdminInfoByEmail);

// ADMIN
router.post("/login", login);

// ADMIN
router.post("/register", register);

// ADMIN -> MANGER
router.get("/manager/all", authentication, getAllManger);

// ADMIN -> MANGER ADD
router.post("/manger", authentication, addManager);

// ADMIN -> ALL MANAGER/SUPER_ADMIN UPDPATE
router.put("/changeAdminPassword/:email", authentication, updateAdminPassword);

// ADMIN -> MANGER DELETE
// router.delete("/manager/:id", authentication, deleteManager);

// ADMIN
router.put(
    "/updateAndPasswordChange/:id",
    authentication,
    updateAndPasswordChange
);

// ADMIN DELETE
router.delete("/manager/:id", authentication, deleteAdmin);

module.exports = router;
