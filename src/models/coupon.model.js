const mongoose = require("mongoose");

const couponSchema = mongoose.Schema({
    couponName: {
        type: String,
        required: true,
    },
    couponCode: {
        type: String,
        required: true,
        unique: true,
    },
    discountType: {
        type: String,
        enum: ["fixedAmount", "percentage"],
        default: "percentage",
    },
    totalAmount: {
        type: Number,
    },
    discount: {
        type: Number,
        required: true,
    },
    // startDate: {
    //     type: Date,
    //     required: true,
    // },
    expireDate: {
        type: Date,
        required: true,
    },
    // status: {
    //     type: String,
    //     status: {
    //         type: String,
    //         enum: ["active", "in-active"],
    //     },
    // },
});
mongoose.models = {};
const Coupon = new mongoose.model("Coupon", couponSchema);
module.exports = Coupon;
