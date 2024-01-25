const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const addressSchema = new Schema(
    {
        shippingName: {
            type: String,
            required: true,
            trim: true,
        },
        shippingEmail: {
            type: String,
        },
        postCode: {
            type: String,
        },
        shippingPhone: {
            type: String,
            required: true,
        },
        country: {
            type: String,
            required: true,
        },
        division: {
            type: String,
            required: true,
        },
        city: {
            type: String,
        },
        district: {
            type: String,
            required: true,
        },
        upazila: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        optionalAddress: {
            type: String,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        selected: {
            type: Boolean,
            enum: [true, false],
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

const Address = new mongoose.model("Address", addressSchema);
module.exports = Address;
