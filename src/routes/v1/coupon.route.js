const express = require("express");
const { authentication } = require("../../config/Authenticate");
const Cart = require("../../models/cart.model");
const Coupon = require("../../models/coupon.model");
const User = require("../../models/user.model");
const router = express.Router();
const cron = require("node-cron");

// CREATE NEW COUPON - ADMIN
router.post("/add", authentication, async (req, res) => {
    try {
        const newCoupon = new Coupon(req.body);
        const data = await newCoupon.save();
        res.status(200).send({ message: "new coupon added!!" });
    } catch (err) {
        if (err.code == 11000) {
            return res.status(500).send({
                message: "Coupon is already taken. Please add a new one!",
            });
        }
        res.status(500).send({ message: "server error!!" });
    }
});

// GET ALL COUPONS - ADMIN
router.get("/", authentication, async (req, res) => {
    try {
        const data = await Coupon.find({});
        res.status(200).send(data);
    } catch (err) {
        res.status(500).send({ message: "server error!!" });
    }
});

// VERIFY COUPON AND UPDATE CART + Users usedCoupons filed
router.post("/verify/:email", async (req, res) => {
    try {
        const { cartId, couponCode } = req.body;
        if (!cartId || !couponCode || !req.params.email) {
            return res
                .status(400)
                .send({ message: `Coupon id and cartId is required` });
        }
        // coupon
        const dbCoupon = await Coupon.findOne({
            couponCode: couponCode,
        });

        if (!dbCoupon || !dbCoupon.expireDate) {
            return res.status(400).send({ message: `Coupon is invalid!` });
        }

        // check if user is already applied this coupon or not
        const dbUser = await User.findOne({ email: req.params.email });
        const dbCart = await Cart.findOne({ _id: cartId });

        if (!dbCart) {
            return res.status(400).send({ message: `User cart not found!` });
        }

        if (!dbUser) {
            return res.status(400).send({ message: `User not found!` });
        }

        if (dbUser.usedCoupons?.includes(dbCoupon._id)) {
            // Coupon has already been used by the user
            return res
                .status(400)
                .send({ message: `This coupon is already used!` });
        } else {
            dbCart.couponDiscount = dbCoupon._id;
            await dbCart.save();

            res.status(200).send({
                message: `Success! Enjoy your discount`,
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: "There was a server side error!" });
    }
});

// GET SINGLE COUPON by ID - ADMIN

router.get("/:id", authentication, async (req, res) => {
    try {
        const data = await Coupon.findOne({ _id: req.params.id });
        res.status(200).send(data);
    } catch (err) {
        res.status(500).send({ message: "server error!!" });
    }
});

// UPDATE SINGLE COUPON by ID - ADMIN
router.put("/:id", authentication, async (req, res) => {
    try {
        const updateObject = {};

        if (req.body.discount) updateObject.discount = req.body.discount;
        if (req.body.discountType)
            updateObject.discountType = req.body.discountType;
        if (req.body.couponName) updateObject.couponName = req.body.couponName;
        if (req.body.totalAmount)
            updateObject.totalAmount = req.body.totalAmount;
        if (req.body.expireDate) updateObject.expireDate = req.body.expireDate;

        await Coupon.updateOne(
            { _id: req.params.id },
            {
                $set: updateObject,
            },
            {
                useFindAndModify: false,
                new: true,
            }
        );
        res.status(200).send({ message: "coupon information updated!" });
    } catch (err) {
        if (err.code == 11000) {
            res.status(500).send({
                message: "This coupon is already taken. Add a new one!",
            });
        }
        res.status(500).send({ message: "server error!!" });
    }
});

// DELETE SINGLE COUPON by ID - ADMIN
router.delete("/:id", authentication, async (req, res) => {
    try {
        await Coupon.deleteOne({ _id: req.params.id });
        res.status(200).send({ message: "coupon deleted successful!!" });
    } catch (err) {
        res.status(500).send({ message: "server error!!" });
    }
});

//schedule function for off the offer
cron.schedule("*/10 * * * * *", async () => {
    const offers = await Coupon.find({});

    offers?.forEach(async (offer) => {
        const id = offer._id;
        const nowDate = new Date(Date.now()).toISOString();

        const filter = [{ _id: id }, { expireDate: { $lt: nowDate } }];

        const data = await Coupon.findOneAndUpdate(
            {
                $and: filter,
            },
            {
                $set: { expireDate: null },
            },
            {
                new: true,
                useFindAndModify: false,
            }
        );
    });
});

module.exports = router;
