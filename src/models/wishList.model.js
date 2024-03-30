const mongoose = require("mongoose");

const wishListSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
    },
  ],
});

const WishList = mongoose.model("WishList", wishListSchema);
module.exports = WishList;
