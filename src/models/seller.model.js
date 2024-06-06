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
    profileUrl: {
        type: String
    },
    coverUrl: {
        type: String
    },
    slug: {
        type: String,
        required: [true, "slug name is required"],
        trim: true,
        minLength: [3, "slug must be at least 3 characters long"],
        maxLength: [100, "slug must be at most 100 characters long"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        // validate: [validator.isEmail, "Provide a valid email"],
        validate: {
            validator: function (value) {
                if (validator.isEmail(value)) {
                    return true; // If it's an email, it's valid
                } else if (validator.isMobilePhone(value, 'any', { strictMode: false })) {
                    // If it's a phone number, check if it's at least 11 digits and starts with "01"
                    return /^(01)[0-9]{9}$/.test(value.replace(/\s/g, '')); // Remove whitespace before validation
                } else {
                    return false; // Neither email nor valid phone number
                }
            },
            message: "Provide a valid email or phone number"
        },
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
    },
    status: {
        type: String,
        enum: ["active", "pending"],
        default: 'pending'
    },
    metaTitle: {
        type: String
    },
    metaDescription: {
        type: String
    },
    address: {
        type: String
    }
}, { timestamps: true });


const Seller = mongoose.model('Seller', sellerSchema)


module.exports = Seller