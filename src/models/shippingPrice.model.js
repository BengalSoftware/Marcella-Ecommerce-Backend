const mongoose = require("mongoose");

const shippingPriceSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        upazila: [
            {
                type: String,
            },
        ],
        price: {
            type: Number,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const ShippingPrice = new mongoose.model("ShippingPrice", shippingPriceSchema);
module.exports = ShippingPrice;
