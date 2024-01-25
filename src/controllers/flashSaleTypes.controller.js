const FlashSaleType = require("../models/flashSaleTypes.model");

const getAllFlashSaleType = async (req, res) => {
    try {
        const data = await FlashSaleType.find({});

        res.status(200).json({
            message: "Success",
            data,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "There was a server side error",
        });
    }
};

// get single FlashSaleType
const getSingleFlashSaleType = async (req, res) => {
    try {
        const data = await FlashSaleType.find({ _id: req.params.id });

        if (data) {
            res.status(200).json({
                message: "Success",
                data: data[0],
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "There was a server side error",
        });
    }
};

const createFlashSaleType = async (req, res) => {
    try {
        if (!req.body.name) {
            return res.status(404).json({
                message: "All filed is required",
            });
        }
        const data = new FlashSaleType({
            name: req.body.name,
        });
        await data.save();

        res.status(200).json({
            message: "Success fully added FlashSaleType",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "There was a server side error",
        });
    }
};
//  update single FlashSaleType
const updateSingleFlashSaleType = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(404).json({
                message: "Id is required",
            });
        }
        await FlashSaleType.findByIdAndUpdate(
            { _id: req.params.id },
            {
                $set: req.body,
            },
            {
                new: true,
            }
        );

        res.status(200).json({
            message: "Success fully updated FlashSaleType",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "There was a server side error",
        });
    }
};

// delete FlashSaleType
const deleteSingleFlashSaleType = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(404).json({
                message: "Id is required",
            });
        }
        await FlashSaleType.deleteOne({
            _id: req.params.id,
        });

        res.status(200).json({
            message: "Success fully added FlashSaleType",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "There was a server side error",
        });
    }
};

// Delete all FlashSaleType
const deleteAllFlashSaleType = async (req, res) => {
    try {
        await FlashSaleType.deleteMany({});

        res.status(200).json({
            message: "Success fully deleted all FlashSaleType",
        });
    } catch (error) {
        res.status(500).json({
            message: "There was a server side error",
        });
    }
};

module.exports = {
    getAllFlashSaleType,
    createFlashSaleType,
    getSingleFlashSaleType,
    deleteSingleFlashSaleType,
    deleteAllFlashSaleType,
    updateSingleFlashSaleType,
};
