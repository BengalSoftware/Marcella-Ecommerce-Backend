const mongoose = require("mongoose");

const cartSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true,
            },
            sellerId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Seller",
                // required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
            offerPrice: {
                type: Number,
                required: true,
            },
            color: String,
            size: String,
        },
    ],
    couponDiscount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Coupon",
    },
});

module.exports = mongoose.model("Cart", cartSchema);
