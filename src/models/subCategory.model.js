const mongoose = require("mongoose");

const subcategorySchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        slug: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        parent: {
            type: mongoose.Types.ObjectId,
            ref: "Category",
        },
        children: [
            {
                type: mongoose.Types.ObjectId,
                ref: "SubcategoryChildren",
            },
        ],
    },
    {
        timestamps: true,
    }
);
mongoose.models = {};
const Subcategory =
    mongoose.model.Subcategory ||
    mongoose.model("Subcategory", subcategorySchema);
module.exports = Subcategory;

// mongoose.models = {};
// const Subcategory =
//     mongoose.model.Subcategory ||
//     new mongoose.model("Subcategory", subcategorySchema);
// module.exports = Subcategory;
