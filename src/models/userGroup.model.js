const mongoose = require('mongoose')

const userGroupSchema = mongoose.Schema({
    groupName: {
        type: String,
        unique: true
    },
    description: {
        type: String,
    },
    discountType: {
        type: String,
        enum: ["fixedAmount", "percentage"],
        default: "percentage"
    },
    discount: {
        type: Number
    },
    totalAmount: {
        type: Number
    },
    user: [
        {
            type: mongoose.Types.ObjectId,
            ref: "User",
            // unique: true,
        }
    ]
})

const CustomerGroup = new mongoose.model("userGroup", userGroupSchema);
module.exports = CustomerGroup;
