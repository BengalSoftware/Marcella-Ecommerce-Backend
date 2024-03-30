const DeliveryInfo = require("../models/deliveryInfo.modal");

const getAllDeliverInfo = async (req, res) => {
    try {
        const data = await DeliveryInfo.find({});

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

// get single DeliveryInfo
const getSingleDeliverInfo = async (req, res) => {
    try {
        const data = await DeliveryInfo.find({ _id: req.params.id });

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

const createDeliverInfo = async (req, res) => {
    try {
        if (!req.body.description) {
            return res.status(404).json({
                message: "All filed is required",
            });
        }
        const data = new DeliveryInfo({
            description: req.body.description,
            banglaDescription: req.body.banglaDescription,
        });
        await data.save();

        res.status(200).json({
            message: "Success fully added DeliveryInfo",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "There was a server side error",
        });
    }
};
//  update single DeliveryInfo
const updateSingleDeliverInfo = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(404).json({
                message: "Id is required",
            });
        }
        await DeliveryInfo.findByIdAndUpdate(
            { _id: req.params.id },
            {
                $set: req.body,
            },
            {
                new: true,
            }
        );

        res.status(200).json({
            message: "Success fully updated DeliveryInfo",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "There was a server side error",
        });
    }
};

// delete DeliveryInfo
const deleteSingleDeliverInfo = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(404).json({
                message: "Id is required",
            });
        }
        await DeliveryInfo.deleteOne({
            _id: req.params.id,
        });

        res.status(200).json({
            message: "Success fully added DeliveryInfo",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "There was a server side error",
        });
    }
};

// Delete all DeliveryInfo
const deleteAllDeliverInfo = async (req, res) => {
    try {
        await DeliveryInfo.deleteMany({});

        res.status(200).json({
            message: "Success fully deleted all DeliveryInfo",
        });
    } catch (error) {
        res.status(500).json({
            message: "There was a server side error",
        });
    }
};

module.exports = {
    getAllDeliverInfo,
    createDeliverInfo,
    getSingleDeliverInfo,
    deleteSingleDeliverInfo,
    deleteAllDeliverInfo,
    updateSingleDeliverInfo,
};
