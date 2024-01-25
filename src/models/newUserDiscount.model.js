const mongoose = require("mongoose");

const newUserDiscountSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: [true, "This is already taken"],
            default: "New user discount",
        },
        discountType: {
            type: String,
            enum: ["fixedAmount", "percentage"],
            default: "percentage",
            required: true,
        },
        discount: {
            type: Number,
            required: true,
        },
        startDate: Date,
        endDate: Date,
        timeStamps: {
            type: Number,
        },
        status: {
            type: String,
            enum: ["active", "in-active"],
            default: "in-active",
        },
    },
    {
        timestamps: true,
    }
);

const NewUserDiscount = mongoose.model(
    "NewUserDiscount",
    newUserDiscountSchema
);
module.exports = NewUserDiscount;
