const mongoose = require("mongoose");

const StoreLocation = mongoose.Schema(
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
module.exports = mongoose.model("StoreLocation", StoreLocation);
