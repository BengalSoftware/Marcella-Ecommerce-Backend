const express = require("express");
const WishList = require("../../models/wishList.model");
const User = require("../../models/user.model");
const { authentication } = require("../../config/Authenticate");
const router = express.Router();

// GET ALL WISHLIST  - ADMIN
router.get("/", authentication, async (req, res) => {
    try {
        const data = await WishList.find({});
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({
            error: "There was a server side error!",
        });
    }
});

// GET ALL WISHLIST BY EMAIL - CLIENT
router.get("/:email", async (req, res) => {
    try {
        const query = await User.findOne({ email: req.params.email });
        console.log(", query", query);
        const userId = query?._id;

        const products = await WishList.findOne({ user: userId })
            .populate({
                path: "products.product",
            });
        const data = products?.products.reverse();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({
            error: "There was a server side error!",
        });
    }
});

// ADD PRODUCT TO WISHLIST - CLIENT BY-EMAIL and ProductId
router.post("/:email", async (req, res) => {
    try {
        if (!req.body.product) {
            return res.status(400).send({ message: "Product not selected!!" });
        }

        const user = await User.findOne({ email: req.params.email });
        const userId = user?._id.toString();
        if (userId) {
            // checking the user is exist or not
            const isExistUserOnWishList = await WishList.findOne({
                user: user?.id,
            });

            // if user is exist and product already exists on wishList then return without save
            let isExist = false;
            isExistUserOnWishList?.products?.forEach((product) => {
                if (product?.product.equals(req.body.product)) {
                    // product?.product means product id
                    isExist = true;
                }
            });
            if (isExist) {
                return res
                    .status(400)
                    .json({ message: "Product is already in wishList" });
            }

            // if user is exist and product are not already added then the bellow code will execute
            if (!isExistUserOnWishList) {
                const newWishList = new WishList({
                    user: userId,
                    products: [
                        {
                            product: req.body.product,
                        },
                    ],
                });

                await newWishList.save();
                res.status(200).json({
                    message: "WishList added successfully!",
                });
            } else {
                // if user is exist on wishList and product is not already added then the bellow code will execute
                const wishlist = await WishList.findOne({ user: userId });

                if (wishlist.products.length >= 15) {
                    wishlist.products.shift(); // Remove the last product from the array
                }
                console.log(wishlist.products)

                wishlist.products.push({
                    product: req.body.product,
                });
                // Add the new product to the array

                await wishlist.save(); // Save the modified wishlist

                res.status(200).json({
                    message: "wishlist added successfully",
                });
            }
        } else {
            // if user not exist on user table then the bellow code will execute
            return res.status(400).send({ message: "User not found!" });
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error: "There was a server side error!",
        });
    }
});

// DELETE A SINGLE PRODUCT ON WISHLIST - CLIENT
router.delete("/:email", async (req, res) => {
    try {
        const query = await User.find({ email: req.params.email });
        const userId = query[0]._id.toString();

        await WishList.findOneAndUpdate(
            { user: userId },
            {
                $pull: {
                    products: {
                        product: req.body.productId,
                    },
                },
            },
            {
                useFindAndModify: false,
                new: true,
            }
        );

        res.status(200).json({ message: "wishList delete successfully!!" });
    } catch (error) {
        res.status(500).json({ message: "wishList delete failed!!" });
    }
});
// DELETE A SINGLE User WISHLIST - CLIENT
router.delete("/all/:email", async (req, res) => {
    try {
        const query = await User.find({ email: req.params.email });
        const userId = query[0]._id.toString();

        await WishList.deleteOne(
            {
                user: userId,
            }
        );

        res.status(200).json({ message: "wishList delete successfully!!" });
    } catch (error) {
        res.status(500).json({ message: "wishList delete failed!!" });
    }
});

module.exports = router;
