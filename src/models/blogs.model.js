const mongoose = require("mongoose");

const Blogs = mongoose.Schema(
    {
        image: String,
        author: String,
        blogTitle: { type: String, required: true },
        description: {
            type: String,
            required: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        tags: [
            {
                type: String,
            },
        ],
    },
    {
        timestamps: true,
    }
);
mongoose.models = {};
module.exports = mongoose.model("Blogs", Blogs);
