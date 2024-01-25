const StoreLocation = require("../models/storeLocation.model");

const getAllStoreLocation = async (req, res) => {
    try {
        const data = await StoreLocation.find({});

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

// get single StoreLocation
const getSingleStoreLocation = async (req, res) => {
    try {
        const data = await StoreLocation.find({ _id: req.params.id });

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

const createStoreLocation = async (req, res) => {
    try {
        if (!req.body.description) {
            return res.status(404).json({
                message: "All filed is required",
            });
        }
        const data = new StoreLocation({
            description: req.body.description,
        });
        await data.save();

        res.status(200).json({
            message: "Success fully added StoreLocation",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "There was a server side error",
        });
    }
};
//  update single StoreLocation
const updateSingleStoreLocation = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(404).json({
                message: "Id is required",
            });
        }
        await StoreLocation.findByIdAndUpdate(
            { _id: req.params.id },
            {
                $set: req.body,
            },
            {
                new: true,
            }
        );

        res.status(200).json({
            message: "Success fully updated StoreLocation",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "There was a server side error",
        });
    }
};

// delete StoreLocation
const deleteSingleStoreLocation = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(404).json({
                message: "Id is required",
            });
        }
        await StoreLocation.deleteOne({
            _id: req.params.id,
        });

        res.status(200).json({
            message: "Success fully added StoreLocation",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "There was a server side error",
        });
    }
};

// Delete all StoreLocation
const deleteAllStoreLocation = async (req, res) => {
    try {
        await StoreLocation.deleteMany({});

        res.status(200).json({
            message: "Success fully deleted all StoreLocation",
        });
    } catch (error) {
        res.status(500).json({
            message: "There was a server side error",
        });
    }
};

module.exports = {
    getAllStoreLocation,
    createStoreLocation,
    getSingleStoreLocation,
    deleteSingleStoreLocation,
    deleteAllStoreLocation,
    updateSingleStoreLocation,
};
