const mongoose = require("mongoose");

const categorySchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
        },

        slug: {
            type: String,
            required: true,
        },

        sortOrder: {
            type: Number,
            required: true,
        },

        children: [
            {
                type: mongoose.Types.ObjectId,
                ref: "Subcategory",
            },
        ],
    },
    {
        timeStamps: true,
    }
);
mongoose.models = {};
const Category =
    mongoose.model.Category || mongoose.model("Category", categorySchema);
module.exports = Category;
