const mongoose = require("mongoose");
const validator = require("validator");

const newsLetterSchema = mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            validate: [validator.isEmail, "Invalid email address"],
        },
    },
    {
        timestamps: true,
    }
);

const NewsLetter = mongoose.model("NewLetterEmail", newsLetterSchema);
module.exports = NewsLetter;
