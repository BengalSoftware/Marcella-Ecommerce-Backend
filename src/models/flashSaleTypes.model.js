const mongoose = require("mongoose");

const flashSaleTypesSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        image: String
    },
    {
        timestamps: true,
    }
);
mongoose.models = {};
module.exports = mongoose.model("flashSaleTypes", flashSaleTypesSchema);
