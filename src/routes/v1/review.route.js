const express = require("express");
const router = express.Router();
const { authentication } = require("../../config/Authenticate");
const reviewController = require("../../controllers/review.controller");

// DONE - GET ALL REVIEWS - ADMIN
router.get("/", authentication, reviewController.getReviews);

// DONE - GET TOTAL REVIEWS - ADMIN
router.get("/totalReviews", authentication, reviewController.getTotalReviews);

// DONE - GET TOTAL REVIEWS BY MONTH - ADMIN
router.get(
    "/totalReviewsByMonth",
    authentication,
    reviewController.getTotalReviewsByMonth
);

router.get("/allByProductId/:name", reviewController.getReviewsByProductId);

// GET ALL REVIEWS by REVIEW EMAIL
router.get("/:email", reviewController.getReviewsByUser);

// CREATE A REVIEW
router.post("/:email", reviewController.createReview);

// CREATE A upVote Like on Review
router.put("/:email", reviewController.createLikeUpVote);

// TODO - UPDATE SINGLE REVIEW - CLIENT

// DELETE SINGLE REVIEW - CLIENT
router.delete("/:id", reviewController.deleteReview);

// TODO - DELETE ALL REVIEWS - ADMIN

module.exports = router;
