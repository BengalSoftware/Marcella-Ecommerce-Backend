const Color = require("../models/color.model");

const getAllColor = async (req, res) => {
    try {
        const data = await Color.find({});

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

// get single Color
const getSingleColor = async (req, res) => {
    try {
        const data = await Color.find({ _id: req.params.id });

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

const createColor = async (req, res) => {
    try {
        if (!req.body.name) {
            return res.status(404).json({
                message: "All filed is required",
            });
        }
        const data = new Color({
            name: req.body.name,
            colorCode: req.body.colorCode,
        });
        await data.save();

        res.status(200).json({
            message: "Success fully added Color",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "There was a server side error",
        });
    }
};
//  update single Color
const updateSingleColor = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(404).json({
                message: "Id is required",
            });
        }
        const updateObj = {};
        if (req.body.name) updateObj.name = req.body.name;
        if (req.body.colorCode) updateObj.colorCode = req.body.colorCode;
        console.log(updateObj);
        await Color.findByIdAndUpdate(
            { _id: req.params.id },
            {
                $set: updateObj,
            },
            {
                new: true,
            }
        );

        res.status(200).json({
            message: "Success fully updated Color",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "There was a server side error",
        });
    }
};

// delete Color
const deleteSingleColor = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(404).json({
                message: "Id is required",
            });
        }
        await Color.deleteOne({
            _id: req.params.id,
        });

        res.status(200).json({
            message: "Success fully added Color",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "There was a server side error",
        });
    }
};

// Delete all Color
const deleteAllColor = async (req, res) => {
    try {
        await Color.deleteMany({});

        res.status(200).json({
            message: "Success fully deleted all Color",
        });
    } catch (error) {
        res.status(500).json({
            message: "There was a server side error",
        });
    }
};

module.exports = {
    getAllColor,
    createColor,
    getSingleColor,
    deleteSingleColor,
    deleteAllColor,
    updateSingleColor,
};
