const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const relatedBannerSchema = mongoose.Schema(
    {
        image: {
            type: String,
            required: true,
        },
        relatedBannerName: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        related: {
            type: String,
            enum: ["product", "category"],
        },
        product: String,
        slug: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        categories: [
            {
                _id: { type: Schema.Types.ObjectId },
                name: String,
            },
        ],
        subCategories: [
            {
                _id: { type: Schema.Types.ObjectId },
                name: String,
            },
        ],
        subCategoryChildren: [
            {
                _id: { type: Schema.Types.ObjectId },
                name: String,
            },
        ],
        url: String,
    },
    {
        timestamps: true,
    }
);

const relatedBanner = mongoose.model(
    "relatedBannerSchema",
    relatedBannerSchema
);
module.exports = relatedBanner;
