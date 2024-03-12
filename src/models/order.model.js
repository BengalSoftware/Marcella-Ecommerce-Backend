const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        userName: {
            type: String,
        },
        // shippingPhone
        userPhone: {
            type: String,
        },
        orderId: {
            type: String,
        },
        products: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },
                sellerId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Seller",
                    // required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                },
                offerPrice: {
                    type: Number,
                    required: true,
                },
                transactionNumber: {
                    type: String,
                },
                transactionType: {
                    type: String,
                },
                paymentStatus: {
                    type: String,
                    enum: [
                        "unpaid",
                        "paid"
                    ],
                    default: "unpaid",
                },
                color: String,
                size: String,
            },
        ],
        address: {
            type: Schema.Types.ObjectId,
            ref: "Address",
            required: true,
        },
        status: {
            type: String,
            enum: [
                "pending",
                "processing",
                "shipped",
                "cancelled",
                "returned",
                "delivered",
                "expired",
            ],
            default: "pending",
            required: true,
        },
        paymentType: {
            type: String,
            enum: ["COD", "SSLCOMMERZ"],
            required: true,
        },
        transactionId: {
            type: String,
        },
        paymentMethod: {
            type: String,
        },
        totalAmount: {
            type: Number,
            required: true,
        },
        discountAmount: {
            type: Number,
        },
        shippingCharge: {
            type: Number,
            required: true,
        },
        couponDiscount: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Coupon",
        },
        report: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "OrderReports",
        },
        notify: false,
    },
    {
        timestamps: true,
    }
);

const Order = new mongoose.model("Order", orderSchema);
module.exports = Order;
