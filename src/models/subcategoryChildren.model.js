const mongoose = require("mongoose");

const subcategoryChildrenSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        slug: {
            type: String,
        },
        description: {
            type: String,
        },
        image: {
            type: String,
        },
        nicheCategory: {
            type: Boolean,
        },
        nicheTitle: {
            type: String,
        },
        subcategory: {
            type: mongoose.Types.ObjectId,
            ref: "Subcategory",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);
mongoose.models = {};
const SubcategoryChildren =
    mongoose.model.SubcategoryChildren ||
    mongoose.model("SubcategoryChildren", subcategoryChildrenSchema);
module.exports = SubcategoryChildren;
