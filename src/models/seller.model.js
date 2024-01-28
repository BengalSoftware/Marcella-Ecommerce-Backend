const { default: mongoose } = require("mongoose");
const validator = require("validator");


const sellerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "name name is required"],
        trim: true,
        minLength: [3, "name must be at least 3 characters long"],
        maxLength: [100, "Name must be at most 100 characters long"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        validate: [validator.isEmail, "Provide a valid email"],
        trim: true,
        lowercase: true,
        unique: true,
    },
    password: {
        type: String,
        minLength: [6, "password must be at least 6 characters long"],
        required: [true, "Password is required"],
    },

    phone: {
        type: String,
        validate: [
            validator.isMobilePhone,
            "Please enter a valid mobile number",
        ],
    },
    verified: {
        type: Boolean,
        enum: ["True", "False"],
        default: false,
    },
    groupName: {
        type: String,
        default: "Default",
    },
    role: {
        type: String,
        default: 'seller'
    }
}, { timestamps: true });


const Seller = mongoose.model('Seller', sellerSchema)


module.exports = Seller