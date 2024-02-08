const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = Schema(
    {
        images: {
            type: Array,
            required: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        slug: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        altTag: {
            type: String,
            default: "product image",
        },
        // weight: {
        //     type: String,
        //     required: true,
        // },
        size: [
            {
                _id: { type: Schema.Types.ObjectId, ref: "Size" },
                name: String,
            },
        ],
        // for flash sale
        flashSale: {
            type: Boolean,
            default: false,
        },
        //for flash sale
        flashSaleOfferType: {
            type: String,
            // required: true,
        },
        color: [
            {
                _id: { type: Schema.Types.ObjectId, ref: "Color" },
                name: String,
            },
        ],
        model: {
            type: String,
            trim: true,
        },
        // manufacturer means brand
        manufacturer: {
            type: Schema.Types.ObjectId,
            ref: "Manufacturer",
        },
        description: {
            type: String,
            // required: true,
        },
        shortDescription: {
            type: String,
            // required: true,
        },
        specification: {
            type: String,
            // required: true,
        },

        data: {
            type: String,
        },

        price: {
            type: Number,
            required: true,
        },
        offerPrice: {
            type: Number,
        },
        quantity: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ["IN-STOCK", "OUT-OF-STOCK", "PRE-ORDER"],
            required: true,
            default: "IN-STOCK",
        },
        tags: [
            {
                type: String,
                trim: true,
            },
        ],
        discountPercentage: {
            type: Number,
        },
        categories: [
            {
                _id: { type: Schema.Types.ObjectId, ref: "Categories" },
                name: String,
            },
        ],
        subcategories: [
            {
                _id: { type: Schema.Types.ObjectId, ref: "SubCategories" },
                name: String,
            },
        ],
        subcategoryChildren: [
            {
                _id: {
                    type: Schema.Types.ObjectId,
                    ref: "SubcategoryChildren",
                },
                name: String,
            },
        ],
        productType: {
            type: String,
            enum: [
                "regular-products",
                "popular-products",
                "new-arrivals",
                "featured-products",
                "flash-sale",
                "mens-fashion",
                "Womens-fashion",
                "mobile-and-gadgets",
                "home-appliance",
                "computing-and-gaming",
            ],
            default: "regular-products",
        },
        rewardPoints: {
            type: Number,
        },
        offers: {
            offerType: String,
            offerName: String,
            discount: Number,
            discountType: String,
            status: String,
            startDate: Date,
            endDate: Date,
            timeStamps: Number,
        },

        expireDate: {
            type: Schema.Types.Mixed,
        },
        // relatedProducts: [
        //     {
        //         _id: { type: Schema.Types.ObjectId, ref: "Product" },
        //         name: String,
        //     },
        // ],
        reviews: [
            {
                type: Schema.Types.ObjectId,
                ref: "Review",
            },
        ],
        totalRating: { type: Number, default: 0 },
        numReviews: { type: Number, default: 0 },
        averageRating: {
            type: mongoose.Decimal128,
            default: 0,
            get: function (v) {
                return parseFloat(v.toString());
            },
            set: function (v) {
                return mongoose.Types.Decimal128.fromString(
                    parseFloat(v).toFixed(1)
                );
            },
        },
    },
    {
        timestamps: true,
    }
);

const Product = new mongoose.model("Product", productSchema);
module.exports = Product;
