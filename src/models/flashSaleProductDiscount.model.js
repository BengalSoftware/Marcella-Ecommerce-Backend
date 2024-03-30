const mongoose = require("mongoose");

const FlatSaleProductDiscountSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: [true, "This is already taken"],
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
        color: {
            type: String
        },
        offerType: [
            {
                // type: mongoose.Schema.Types.ObjectId,
                // ref: "flashSaleTypes",
                // required: true,
                type: String,
                required: true,
            },
        ],
    },
    {
        timestamps: true,
    }
);

const FlatSaleDiscount = mongoose.model(
    "FlatSaleProductDiscount",
    FlatSaleProductDiscountSchema
);

module.exports = FlatSaleDiscount;
