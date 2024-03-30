const mongoose = require("mongoose");

const reviewSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        isPurchased: {
            type: Boolean,
        },
        description: {
            type: String,
            required: true,
            maxLength: 1500,
        },
        upVotes: [
            { userID: { type: mongoose.Schema.Types.ObjectId, ref: "User" } },
        ],
        abuseReports: [
            { userID: { type: mongoose.Schema.Types.ObjectId, ref: "User" } },
        ],
    },
    {
        timestamps: true,
    }
);

const Review = new mongoose.model("Review", reviewSchema);
module.exports = Review;
