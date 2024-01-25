const mongoose = require("mongoose");

const orderReportsSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        orderId: {
            type: String,
            required: true,
        },
        product: {
            type: String,
        },
        reason: {
            type: String,
            required: true,
        },
        requestedFor: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        isUnboxed: {
            type: Boolean,
        },
        status: {
            type: String,
            enum: ["pending", "accepted", "rejected"],
            default: "pending",
        },
    },
    {
        timestamps: true,
    }
);

const OrderReports = mongoose.model("OrderReports", orderReportsSchema);

module.exports = OrderReports;
