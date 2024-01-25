const Address = require("../models/address.model");
const User = require("../models/user.model");
const ShippingPrice = require("../models/shippingPrice.model");
const mongoose = require("mongoose");

// DONE - GET ALL ADDRESSES
const getAddresses = async (req, res) => {
    await Address.find({}).exec((err, data) => {
        if (err) {
            res.status(500).json({
                error: "There was a server side error!",
            });
        } else {
            res.status(200).json({
                result: data,
                message: "Success",
            });
        }
    });
};
// DONE - GET ALL ADDRESSES
const getAddressById = async (req, res) => {
    try {
        if (!req.params.addressId) {
            return res.status(400).json({
                error: "Id is required",
            });
        }
        const data = await Address.findById({ _id: req.params.addressId });

        res.status(200).json({
            data,
            message: "Success",
        });
    } catch (error) {
        res.status(500).json({
            error: "There was a server side error!",
        });
    }
};

// DONE - GET ALL ADDRESSES
const getActiveAddress = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email });
        const userId = user?._id;
        const data = await Address.findOne({ user: userId, selected: true });


        if (!data) {
            return res.status(200).json({
                data,
                shippingPriceData: null,
            });
        }
        // here load the shipping price based on upazila (inside dhaka city, sub city)
        let shippingPriceData = await ShippingPrice.findOne({
            upazila: { $in: data?.upazila },
        });

        // this case for outside dhaka city shipping
        if (!shippingPriceData) {
            shippingPriceData = await ShippingPrice.findOne({
                upazila: { $in: "Outside Dhaka" },
            });
        }

        res.status(200).json({
            data,
            shippingPriceData,
            message: "Success",
        });
    } catch (error) {
        res.status(500).json({
            error: "There was a server side error!",
        });
    }
};

// DONE - GET SINGLE ADDRESS by ID
const getAddress = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email });
        const userId = user?._id;
        const data = await Address.find({ user: userId });

        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: "There was a server side error!",
        });
    }
};

// TODO - GET ADDRESSES by QUERY PARAMS
// const getAddressesByQueryParams = async (req, res) => {
// }

// COMPLETE - CREATE SINGLE ADDRESS
const createAddress = async (req, res) => {

    try {
        const user = await User.findOne({ email: req.params.email });
        const userId = user?._id;
        if (!user) {
            return res.status(400).json({ message: "Email not found!" });
        }
        let allAddress = await Address.find({ user: userId }).sort({ createdAt: 1 });

        if (allAddress.length >= 4) {
            const oldestAddress = allAddress.shift();
            await Address.findByIdAndRemove(oldestAddress._id);
        }

        await Address.updateMany({ user: userId }, { $set: { selected: false } });


        const newAddress = await new Address({
            ...req.body,
            selected: true,
            user: user._id,
        });

        const data = await newAddress.save();

        res.status(200).json({
            result: data,
            message: "Address created successfully!",
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: "There was a server side error!",
        });
    }
};

// TODO - POST MULTIPLE ADDRESSES

// DONE - UPDATE SINGLE ADDRESS
const updateAddress = async (req, res) => {
    try {
        await Address.findByIdAndUpdate(
            { _id: req.params.addressId },

            {
                $set: req.body,
            },
            {
                new: true,
                useFindAndModify: false,
            }
        );

        res.status(200).json({
            message: "Address updated successfully!",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: "There was a server side error!",
        });
    }
};
// DONE - ACTIVE SINGLE ADDRESS
const activeAddress = async (req, res) => {
    try {
        const objectId = mongoose.Types.ObjectId(req.params.userId);
        await Address.updateMany(
            { user: objectId },

            {
                $set: { selected: false },
            },
            {
                new: true,
                useFindAndModify: false,
            }
        );

        await Address.findByIdAndUpdate(
            { _id: req.body.id },

            {
                $set: { selected: true },
            },
            {
                new: true,
                useFindAndModify: false,
            }
        );
        res.status(200).json({
            message: "Address updated successfully!",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: "There was a server side error!",
        });
    }
};

const deleteAddressById = async (req, res) => {
    try {
        if (!req.body.id) {
            return res.status(400).json({
                error: "Id is missing!",
            });
        }

        const user = await User.findOne({ email: req.params.email });
        const data = await Address.find({ user: user._id });
        if (data?.length === 1) {
            return res.status(400).json({
                error: "Must be one address required",
            });
        }

        const deleteAdd = await Address.findOne({ _id: req.body.id });

        if (deleteAdd.selected) {
            return res.status(400).json({
                error: "This address is already selected",
            });
        }

        await Address.deleteOne({ _id: req.body.id });
        res.status(200).json({
            message: "Address has been deleted Successfully!",
        });
    } catch (error) {
        res.status(500).json({
            error: "There was a server side error!",
        });
    }
};

// COMPLETE - DELETE ALL ADDRESSES
const deleteAddresses = async (req, res) => {
    await Address.deleteMany({}, (err) => {
        if (err) {
            res.status(500).json({
                error: "There was a server side error!",
            });
        } else {
            res.status(200).json({
                message: "All addresses deleted successfully!",
            });
        }
    }).clone();
};

module.exports = {
    getAddresses,
    getAddress,
    createAddress,
    updateAddress,
    deleteAddressById,
    deleteAddresses,
    getAddressById,
    activeAddress,
    getActiveAddress,
};
