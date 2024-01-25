const mongoose = require("mongoose");

const Color = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        colorCode: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);
mongoose.models = {};
module.exports = mongoose.model("Color", Color);
