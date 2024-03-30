const express = require("express");
const { authentication } = require("../../config/Authenticate");
const ShippingPrice = require("../../models/shippingPrice.model");
const router = express.Router();

// GET ALL SHIPPING PRICES - ADMIN
router.get("/", authentication, async (req, res) => {
    try {
        const result = await ShippingPrice.find({});
        res.status(200).json({
            result: result,
            message: "Success",
        });
    } catch (err) {
        res.status(500).json({
            error: "There was a server side error!",
        });
    }
});

// CREATE SHIPPING PRICE - ADMIN
router.post("/", authentication, async (req, res) => {
    try {
        if (!req.body.upazila) {
            return res.status(400).json({
                message: "Upazila is required",
            });
        }

        req.body.price = parseInt(req.body.price);

        const data = new ShippingPrice(req.body);
        await data.save();
        res.status(200).json({
            result: data,
            message: "Shipping Price created successfully",
        });
    } catch (err) {
        res.status(500).json({
            message: "There was a server side error!",
        });
    }
});

// GET SINGLE SHIPPING PRICE BY ID - ADMIN
router.get("/:id", authentication, async (req, res) => {
    try {
        const result = await ShippingPrice.findById(req.params.id);
        res.status(200).json({
            result: result,
            message: "Success",
        });
    } catch (err) {
        res.status(500).json({
            error: "There was a server side error!",
        });
    }
});

// GET SINGLE SHIPPING PRICE BY ID - ADMIN
router.delete("/:id", authentication, async (req, res) => {
    try {
        const result = await ShippingPrice.deleteOne({ _id: req.params.id });

        res.status(200).json({
            result: result,
            message: "Success",
        });
    } catch (err) {
        res.status(500).json({
            error: "There was a server side error!",
        });
    }
});

// UPDATE SINGLE SHIPPING PRICE - ADMIN
router.put("/:id", authentication, async (req, res) => {
    try {
        const updateData = {};
        const { price, name, upazila } = req.body || {};
        if (price) updateData.price = price;
        if (name) updateData.name = name;
        if (upazila) updateData.upazila = upazila;

        const result = await ShippingPrice.findByIdAndUpdate(
            req.params.id,
            updateData
        );
        res.status(200).json({
            result: result,
            message: "ShippingPrice created successfully",
        });
    } catch (err) {
        res.status(500).json({
            error: "There was a server side error!",
        });
    }
});

module.exports = router;
