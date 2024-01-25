const mongoose = require("mongoose");

const DeliveryInfo = mongoose.Schema(
    {
        description: {
            type: String,
            required: true,
        },
        banglaDescription: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);
mongoose.models = {};
module.exports = mongoose.model("DeliveryInfo", DeliveryInfo);
