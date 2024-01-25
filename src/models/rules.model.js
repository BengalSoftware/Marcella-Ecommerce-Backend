const mongoose = require("mongoose");

const rulesSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
        },

        image: {
            type: String,
            required: true,
        },
    },
    {
        timeStamps: true,
    }
);
mongoose.models = {};
module.exports = mongoose.model("Rules", rulesSchema);
