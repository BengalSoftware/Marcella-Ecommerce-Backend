const { default: mongoose, Schema } = require("mongoose");

const storeLayoutSchema = new mongoose.Schema({
    images: {
        type: Array
    },
    products: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
        },
    ],
    layout: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "layout",

    }
})

const StoreLayout = mongoose.model('StoreLayout', storeLayoutSchema);
module.exports = StoreLayout