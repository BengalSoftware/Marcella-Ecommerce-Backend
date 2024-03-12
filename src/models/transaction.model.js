const mongoose = require('mongoose');

const transactionSchema = mongoose.Schema(
    {
        transactionNumber: {
            type: String,
            required: true,
        },
        product: {
            type: String
        }
    },
    {
        timestamps: true,
    }
);

const Transaction = mongoose.model("Transaction", transactionSchema);
module.exports = Transaction;
