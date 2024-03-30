const Size = require("../models/size.model");

const getAllSize = async (req, res) => {
    try {
        const data = await Size.find({});

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

// get single Size
const getSingleSize = async (req, res) => {
    try {
        const data = await Size.find({ _id: req.params.id });

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

const createSize = async (req, res) => {
    try {
        if (!req.body.name) {
            return res.status(404).json({
                message: "All filed is required",
            });
        }
        const data = new Size({
            name: req.body.name,
        });
        await data.save();

        res.status(200).json({
            message: "Success fully added Size",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "There was a server side error",
        });
    }
};
//  update single Size
const updateSingleSize = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(404).json({
                message: "Id is required",
            });
        }
        await Size.findByIdAndUpdate(
            { _id: req.params.id },
            {
                $set: req.body,
            },
            {
                new: true,
            }
        );

        res.status(200).json({
            message: "Success fully updated Size",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "There was a server side error",
        });
    }
};

// delete Size
const deleteSingleSize = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(404).json({
                message: "Id is required",
            });
        }
        await Size.deleteOne({
            _id: req.params.id,
        });

        res.status(200).json({
            message: "Success fully added Size",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "There was a server side error",
        });
    }
};

// Delete all Size
const deleteAllSize = async (req, res) => {
    try {
        await Size.deleteMany({});

        res.status(200).json({
            message: "Success fully deleted all Size",
        });
    } catch (error) {
        res.status(500).json({
            message: "There was a server side error",
        });
    }
};

module.exports = {
    getAllSize,
    createSize,
    getSingleSize,
    deleteSingleSize,
    deleteAllSize,
    updateSingleSize,
};
