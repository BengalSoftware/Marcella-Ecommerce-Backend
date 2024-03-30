const mongoose = require("mongoose");

const FaqSchema = mongoose.Schema(
    {
        description: {
            type: String,
            required: true,
        },
        title: { type: String, required: true },
    },
    {
        timestamps: true,
    }
);
mongoose.models = {};
module.exports = mongoose.model("Faq", FaqSchema);
