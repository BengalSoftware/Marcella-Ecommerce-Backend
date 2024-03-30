const mongoose = require("mongoose");

const productTypeSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const ProductType = new mongoose.model("ProductType", productTypeSchema);
module.exports = ProductType;
