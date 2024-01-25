const mongoose = require("mongoose");

const Footer = mongoose.Schema(
    {
        text: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);
mongoose.models = {};
module.exports = mongoose.model("Footer", Footer);
