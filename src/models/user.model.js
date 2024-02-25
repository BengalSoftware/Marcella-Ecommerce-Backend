const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
    {
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

        gender: {
            type: String,
            // enum: ["Male", "Female", "Other"],
        },
        photoUrl: {
            type: String,
            default:
                "https://i.ibb.co/QKdm1pQ/png-transparent-user-profile-default-computer-icons-network-video-recorder-avatar-cartoon-maker-blue.png",
        },
        orderCompletion: {
            type: Number,
            default: 0,
        },
        rewardPoints: {
            type: Number,
            default: 0,
        },
        role: {
            type: String,
            default: 'user'
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
        googleId: {
            type: String,
        },
        addresses: [
            {
                type: mongoose.Types.ObjectId,
                ref: "Address",
            },
        ],
        usedCoupons: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Coupon",
            },
        ],
        // shippingPrice: {
        //     type: Number,
        // },
        confirmationToken: String,
        expiredTokenDate: Date,
        passwordChangedAt: Date,
        passwordResetToken: String,
        passwordResetExpires: Date,
    },
    {
        timestamps: true,
    }
);

// hash user password
// userSchema.pre("save", function (next) {
//   this.confirmPassword = undefined; // not save on database

//   next();
// });

// compare password for login
userSchema.methods.comparePassword = function (password, hash) {
    console.log(password, hash);
    const isPasswordValid = bcrypt.compareSync(password, hash);
    return isPasswordValid;
};

// generate confirmation token for user
userSchema.methods.generateConfirmationToken = function () {
    // user model save a confirmation token
    const token = process.env.JWT_SECRET;
    this.confirmationToken = token;

    // user model save token expire date for verification email
    let registrationTime = new Date();
    let expirationTime = new Date(
        registrationTime.getTime() + 24 * 60 * 60 * 1000
    );
    this.expiredTokenDate = expirationTime;

    return token;
};
mongoose.models = {};
const User = mongoose.model("User", userSchema);
module.exports = User;
