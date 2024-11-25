const express = require("express");
const authController = require("../../controllers/auth.controller");
const passport = require("passport");
const { generateToken } = require("../../utils/token");
const router = express.Router();
require("dotenv").config();

// DONE - REGISTER SINGLE USER - CLIENT
router.post("/register", authController.register);

// DONE - REGISTER BECOME A SELLER
router.post("/seller-register", authController.sellerRegister);

// DONE - GET ALL SELLER
router.post("/seller", authController.seller);

// DONE - GET single SELLER
router.post("/seller/:email", authController.singleSeller);

// DONE - GET SINGLE SELLER CLIENT
router.post("/client-seller/:id", authController.singleSellerClient);

// DONE - UPDATE SINGLE SELLER
router.put("/seller/:id", authController.updateSeller);

// DONE - LOGIN SINGLE USER - CLIENT
router.post("/login", authController.login);

// DONE - VERIFICATION MAIL SEND - CLIENT
router.post("/resendVerificationEmail", authController.resendVerificationEmail);

// DONE - VERIFICATION MAIL SEND - CLIENT
router.post("/sendForgetPasswordEmail", authController.sendForgetPasswordEmail);

// DONE - VERIFICATION MAIL SEND - CLIENT
router.post("/resetPassword", authController.resetPassword);

// DONE - CONFIRMATION EMAIL - CLIENT
router.get("/confirmation/:token", authController.confirmation);

// GOOGLE LOGIN FAILED URL -> CLIENT
router.get("/login/failed", (req, res) => {
    res.status(400).json({
        success: false,
        message: "failure",
    });
});

// LOG OUT ROUTE GOOGLE
router.get("/logout", (req, res, next) => {
    req.logout(function () {
        res.redirect(process.env.CLIENT_URL);
    });
});

// GOOGLE LOGIN SUCCESS URL
router.get("/login/success", (req, res) => {
    // DONE make a token to send google user
    try {
        if (req.user) {
            const user = {
                email: req.user.emails[0].value,
                verified: req.user.emails[0].verified,
            };
            const token = generateToken(user);
            res.status(200).json({
                data: {
                    token: token,
                    user: user,
                },
                message: "successfully oAuth login",
                success: true
            });
            console.log(user);
        }
        else
        {
            res.status(401).json({
                success: false,
                message: "No user found",
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "failure",
        });
    }
});

// DONE - LOGIN SINGLE USER GOOGLE
router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

checkAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login/failed");
};
// CALLBACK URL -> GOOGLE
router.get(
    "/google/callback",

    passport.authenticate("google", {
        successRedirect: process.env.CLIENT_URL + "/account",
        failureRedirect: process.env.CLIENT_URL + "/login",
    })
);

//Use the req.isAuthenticated() function to check if user is Authenticated

//Define the Protected Route, by using the "checkAuthenticated" function defined above as middleware
router.get("/dashboard", checkAuthenticated, (req, res) => {
    res.redirect(process.env.CLIENT_URL);
});

module.exports = router;
