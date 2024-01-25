const express = require("express");
const Cart = require("../../models/cart.model");
const User = require("../../models/user.model");
const { authentication } = require("../../config/Authenticate");
const { serverError } = require("../../utils/error");
const router = express.Router();
const ShippingPrice = require("../../models/shippingPrice.model");
const Address = require("../../models/address.model");
const CustomerGroup = require("../../models/userGroup.model");
const Product = require("../../models/product.model");
const mongoose = require("mongoose");
const cron = require("node-cron");
const FlashSaleOffer = require("../../models/flashSaleProductDiscount.model");
const Order = require("../../models/order.model");

//  all cart getting - ADMIN
router.get("/", authentication, async (req, res) => {
    try {
        const data = await Cart.find({});
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({
            error: "There was a server side error!",
        });
    }
});

// get cart with total & subtotal

/**
 * @param {req.params aspect userEmail}
 *
 * @query {req.query aspect user district like: {district: "Dhaka"/"Khulna"} this query is optional it's only need on checkout page for get delivery charge}
 *
 * @return {
 *                      subtotal: Math.round(subTotalPrice),
 *                      discount: `${coupon?.discount}${
 *                            coupon?.discountType === "percentage" ? "%" : "TK"
 *                        }`,
 *                      discountAmount: Math.round(totalDiscount),
 *                      shippingCharge: shippingPriceData?.price,
 *                      total: Math.round(total),
 *                      cartData: cart,
 *                      totalQuantity: totalQuantity || 0,}
 *
 */
router.get("/myCart/:email", async (req, res) => {
    try {
        //Step 1 -> First loads are  cart data , load coupon by coupon code, load shipping charge and load customer group
        const query = await User.findOne({ email: req.params.email });
        const userId = query?._id?.toString();

        const cart = await Cart.findOne({ user: userId }).populate(
            "user products.product couponDiscount"
        );

        if (cart?.products.length === 0) {
            cart.couponDiscount = undefined;
            await cart.save();
            return res
                .status(200)
                .json({ message: "No products on this cart" });
        }

        // get the  shipping price
        let shippingPriceData = null;
        if (req.params.email) {
            const address = await Address.findOne({
                user: userId,
                selected: true,
            });
            // here load the shipping price based on upazila (inside dhaka city, sub city)
            shippingPriceData = await ShippingPrice.findOne({
                upazila: { $in: address?.upazila },
            });
            // this case for outside dhaka city shipping
            if (!shippingPriceData) {
                shippingPriceData = await ShippingPrice.findOne({
                    upazila: { $in: "Outside Dhaka" },
                });
            }
        }

        // check this user has already any order previously
        const isFirstOrder = await Order.findOne({ user: userId });

        //customer group
        let customerGroup = null;
        if (!isFirstOrder) {
            customerGroup = await CustomerGroup.findOne({
                groupName: cart?.user?.groupName,
            });
        }

        let total = 0;
        let discount = 0;
        let discountAmount = 0;

        let subTotalPrice = cart?.products?.reduce(
            (totalValue, currentValue) =>
                totalValue +
                // currentValue?.quantity * parseInt(currentValue?.product?.price),
                currentValue?.quantity *
                parseInt(
                    // discountCalculate(currentValue?.product) |
                    currentValue?.product?.offerPrice
                ),
            0
        );

        // if customer group discount is available then calculate discount else total with subtotal price
        if (
            customerGroup?.discount > 0 &&
            subTotalPrice > customerGroup?.discountAmount
        ) {
            if (customerGroup?.discountType === "fixedAmount") {
                if (subTotalPrice > customerGroup?.totalAmount) {
                    discount = customerGroup?.discount;
                    total = subTotalPrice - discount;
                }
            }

            // if percentage
            if (customerGroup?.discountType === "percentage") {
                if (subTotalPrice > customerGroup?.totalAmount) {
                    discount = customerGroup?.discount;
                    discountAmount =
                        (customerGroup?.discount / 100) * subTotalPrice;
                    total = subTotalPrice - discount;
                }
            }
        } else {
            total += subTotalPrice;
        }

        // if shipping available the add total price with shipping charge
        if (shippingPriceData) {
            total += shippingPriceData?.price;
        }

        const coupon = cart?.couponDiscount || null;

        // calculate total quantity
        let totalQuantity = cart?.products?.reduce(
            (tQuantity, currentQuantity) =>
                tQuantity + currentQuantity?.quantity,
            0
        );

        // check if coupon is valid then calculate discount price else not calculate
        // expire date will be null when will expire, so here check if expired date is available
        if (coupon && coupon.expireDate) {
            let totalDiscount = 0;
            if (coupon?.discountType === "percentage") {
                if (coupon?.totalAmount <= subTotalPrice) {
                    totalDiscount = subTotalPrice * (coupon?.discount / 100);
                    total -= totalDiscount;
                }
            } else if (coupon?.discountType === "fixedAmount") {
                if (coupon?.totalAmount <= subTotalPrice) {
                    totalDiscount = coupon?.discount;
                    total -= totalDiscount;
                }
            }
            // check if total amount is full fill the coupon total price condition
            if (coupon?.totalAmount <= subTotalPrice) {
                res.status(200).json({
                    data: {
                        subtotal: Math.round(subTotalPrice),
                        discount: `${coupon?.discount}${coupon?.discountType === "percentage" ? "%" : "TK"
                            }`,
                        discountAmount: Math.round(totalDiscount),
                        shippingCharge: shippingPriceData?.price,
                        total: Math.round(total),
                        cartData: cart,
                        totalQuantity: totalQuantity || 0,
                    },
                    message: "Success",
                });
            } else {
                return res.status(200).json({
                    data: {
                        subtotal: Math.round(subTotalPrice),
                        discountAmount: Math.round(totalDiscount),
                        //  it will be show when coupon applied but total amount is less than coupon total price
                        activateCoupon: coupon?.totalAmount - subTotalPrice,

                        shippingCharge: shippingPriceData?.price,
                        total: Math.round(total),
                        cartData: cart,
                        totalQuantity: totalQuantity || 0,
                    },
                    message: "Success",
                });
            }
        } else {
            res.status(200).json({
                data: {
                    subtotal: Math.round(subTotalPrice),
                    discountAmount: Math.round(discountAmount),
                    discount: `${discount ? discount : 0}${customerGroup?.discountType === "percentage"
                        ? "% for first time order"
                        : "TK for first time order"
                        }`,
                    shippingCharge: shippingPriceData?.price,
                    total: Math.round(total),
                    cartData: cart,
                    totalQuantity: totalQuantity || 0,
                },
                message: "Coupon code is invalid",
            });
        }
    } catch (err) {
        res.status(500).send({ message: "There was a server side error!" });
    }
});

// TODO: Remove if no need
router.post("/productsId", async (req, res) => {
    try {
        const query = req.body.map((p) => p._id);

        const products = await Product.find({ _id: { $in: query } });
        const data = [];

        req.body.forEach((item) => {
            products.forEach((d) => {
                if (item._id === d._id.toString()) {
                    data.push({
                        product: d,
                        quantity: item.qty,
                    });
                }
            });
        });
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: "There was an server side error" });
    }
});
/**
 * @param {for increase cart quantity aspect user email by params and product id is object {product: productId}}
 * @param {for decrease cart quantity aspect user email by params and product id & minusQty is object
 * { product: product, minusQty: currentQuantity }}
 *
 *
 */

// add product to cart - CLIENT
router.post("/cartAdd/:email", async (req, res) => {
    if (!req.body.product) {
        return res.status(500).send({ message: "Product is missing!!" });
    } else {
        const query = await User.findOne({ email: req.params.email });

        if (!query) {
            return res.status(200).send({ message: "User not found!" });
        } else {
            const userId = query._id.toString();

            const findUserCart = await Cart.findOne({ user: userId });

            if (!findUserCart) {
                try {
                    const dbProduct = await Product.findOne({
                        _id: req.body.product,
                    });
                    // check product id is exists
                    if (!dbProduct) {
                        return res
                            .status(404)
                            .send({ message: "Product not found" });
                    }
                    const newCart = new Cart({
                        user: userId,
                        products: [
                            {
                                product: req.body.product,
                                quantity: req.body?.quantity || 1,
                                offerPrice: dbProduct.offerPrice,
                                color: req.body?.color,
                                size: req.body?.size,
                            },
                        ],
                    });
                    const data = await newCart.save();
                    res.status(200).json({
                        message:
                            req.params.email + " cart inserted successfully",
                        data: data,
                    });
                } catch (err) {
                    if (err) {
                        serverError(res, err);
                    }
                }
            } else {
                const dbProduct = await Product.findOne({
                    _id: req.body.product,
                });
                // check product id is exists
                if (!dbProduct) {
                    return res
                        .status(404)
                        .send({ message: "Product not found" });
                }
                // this case for user already have a cart now push on product on products filed
                const target = await findUserCart.products.find((i) => {
                    if (req.body.color && req.body.size) {
                        if (
                            i.product == req.body.product &&
                            i.color === req.body.color &&
                            i.size === req.body.size
                        )
                            return i;
                    } else if (req.body.color) {
                        if (
                            i.product == req.body.product &&
                            i.color === req.body.color
                        )
                            return i;
                    } else if (req.body.size) {
                        if (
                            i.product == req.body.product &&
                            i.size === req.body.size
                        ) {
                            return i;
                        }
                    } else {
                        return i.product == req.body.product;
                    }
                });

                if (target) {
                    try {
                        let newQuantity = 0;

                        if (req.body.quantity) {
                            newQuantity = target.quantity + req.body.quantity;
                        } else if (req.body.minusQty) {
                            newQuantity = target.quantity - 1;
                        } else {
                            newQuantity = target.quantity + 1;
                        }
                        //decide if previous color & size is same then update or new add

                        await Cart.findOneAndUpdate(
                            {
                                user: userId,
                                // "products.product": req.body.product,
                                "products._id": target._id,
                            },
                            {
                                $set: {
                                    "products.$.quantity": newQuantity,
                                },
                            },
                            {
                                useFindAndModify: false,
                                new: true,
                            }
                        );

                        res.status(200).json({
                            message: "cart product updated successfully",
                            // data: data,
                        });
                    } catch (error) {
                        res.status(500).json({
                            message: "cart product updated failed!!",
                        });
                    }
                } else {
                    // if user have an cart already but product id is not exist on user cart then this case work
                    try {
                        await Cart.updateOne(
                            { user: userId },
                            {
                                $push: {
                                    products: {
                                        product: req.body.product,
                                        quantity: req.body?.quantity || 1,
                                        offerPrice: dbProduct.offerPrice,
                                        color: req.body.color,
                                        size: req.body.size,
                                    },
                                },
                            }
                        );
                        res.status(200).send({
                            message: "Particular user cart updated!",
                        });
                    } catch (err) {
                        res.status(500).send(
                            "Particular user cart updated failed!!"
                        );
                    }
                }
            }
        }
    }
});

/**
 * @param {aspect email on parameter}
 * @param {aspect productId on body {productId: productId}}
 *
 */
// cart delete one by one editing - CLIENT
router.delete("/cartEdit/:email", async (req, res) => {
    try {
        const query = await User.find({ email: req.params.email });
        const userId = query[0]._id.toString();
        if (!req.body.cartId) {
            return res.status(404).send({ message: "cart id not found!" });
        }
        await Cart.findOneAndUpdate(
            { user: userId },
            {
                $pull: {
                    products: {
                        _id: req.body.cartId,
                    },
                },
            },
            {
                useFindAndModify: false,
                new: true,
            }
        );

        res.status(200).json({ message: "Cart delete successfully!!" });
    } catch (error) {
        res.status(500).json({ message: "cart delete failed!!" });
    }
});

// MERGE CART WITH LOCAL STORAGE DATA -> CLIENT

/**
 * @param {aspect email on parameter}
 * @param {req.body =>  aspect products array on body [{product: productId, quantity: number}]}
 *
 * @return {if this user not exist on Cart on db, then create Cart and save if !cart}
 * @return {if user have already a Cart on db then check every product if match with cart or not
 *          if match update quantity if not match find Product on db and push new product on cart.products finally save cart }
 *
 */
router.post("/mergeProduct/:email", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email });
        const userId = user._id.toString();

        const cart = await Cart.findOne({ user: userId });
        const localProducts = req.body.products || [];
        if (!cart) {
            // If cart does not exist, create a new cart with local cart data
            // If cart does not exist, modify localCartData and save it as a new cart
            const modifiedLocalCartData = await Promise.all(
                localProducts.map(async (localProduct) => {
                    // Find product in the database by productId
                    const product = await Product.findOne({
                        _id: localProduct.product,
                    });

                    if (product) {
                        // If product exists, return the modified localProduct with product details
                        return {
                            product: localProduct.product,
                            quantity:
                                localProduct.quantity > 0
                                    ? localProduct.quantity
                                    : 1, // Set minimum quantity as 1
                            offerPrice: product?.offerPrice || product?.price, // Include product details in localProduct
                            color: localProduct?.color || undefined,
                            size: localProduct?.size || undefined,
                        };
                    } else {
                        // If product does not exist, return null for this localProduct
                        return null;
                    }
                })
            );

            const newCart = new Cart({
                user: userId,
                products: modifiedLocalCartData,
            });
            await newCart.save();
        } else {
            // If cart already exists, update the cart data by merging local cart data

            await Promise.all(
                localProducts.map(async (localProduct) => {
                    const existingProduct = cart.products.find(
                        (dbProduct) =>
                            dbProduct.product.toString() ===
                            localProduct.product
                    );
                    if (existingProduct) {
                        // If product already exists in cart, update the quantity
                        existingProduct.quantity += localProduct.quantity;
                        if (localProduct.color)
                            existingProduct.color = localProduct?.color;
                        if (localProduct.size)
                            existingProduct.size = localProduct?.size;
                    } else {
                        // If product does not exist in cart, add it to the products array
                        const dbProduct = await Product.findOne({
                            _id: localProduct.product,
                        });
                        if (dbProduct) {
                            const cartProduct = {
                                product: localProduct.product,
                                quantity: localProduct.quantity,
                                offerPrice: dbProduct?.offerPrice || dbProduct.price,
                                color: localProduct?.color || undefined,
                                size: localProduct?.size || undefined,
                            };
                            cart.products.push(cartProduct);
                        }
                    }
                })
            );
            await cart.save();
        }

        // Return success message
        res.status(200).json({ message: "Success", data: cart });
    } catch (error) {
        res.status(500).json({ message: "There was a server side error" });
    }
});

// USER CART ALL PRODUCTS DELETE - CLIENT
router.delete("/userCartDelete/:email", async (req, res) => {
    try {
        const query = await User.find({ email: req.params.email });
        if (query.length == 0) {
            return res.status(400).send({ message: "user not found ! " });
        } else {
            const userId = query[0]._id.toString();
            await Cart.deleteOne({ user: userId });
            res.status(200).send({ message: "Cart delete successfully!!" });
        }
    } catch (err) {
        if (err) {
            res.status(500).json({ message: "cart delete!!" });
        }
    }
});

//ownerless cart delete - ADMIN
router.delete("/ownerlessDelete/:id", authentication, async (req, res) => {
    try {
        await Cart.deleteOne({ _id: req.params.id });
        res.status(500).send({
            message: "ownerless cart delete successfully!!",
        });
    } catch (err) {
        if (err) {
            res.status(500).json({
                message: "ownerless cart cart delete failed!!",
            });
        }
    }
});

// All cart delete - ADMIN
router.delete("/deleteAll", authentication, async (req, res) => {
    try {
        await Cart.remove();
        res.status(500).send({ message: "all cart delete successfully!!" });
    } catch (err) {
        if (err) {
            res.status(500).json({ message: "all cart cart delete failed!!" });
        }
    }
});

// this function for if any user flash sale product store there cart but flash sale offer will expire but he/she not order placed then those type of product will remover form there cart

cron.schedule("*/10 * * * * *", async () => {
    const allInActiveFlashOffers = await FlashSaleOffer.find({
        status: "in-active",
    });

    for (const offer of allInActiveFlashOffers) {
        const products = await Product.find({
            flashSaleOfferType: { $in: offer.offerType },
        });
        if (products?.length > 0)
            for (const product of products || {}) {
                const id = mongoose.Types.ObjectId(product._id);
                await Cart.deleteMany({
                    "products.product": id,
                });
            }
    }

    // Loop through the products and delete their corresponding cart items
});

module.exports = router;
