const Returns = require("../models/returns.model");

const getAllReturns = async (req, res) => {
    try {
        const data = await Returns.find({});

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

// get single Returns
const getSingleReturn = async (req, res) => {
    try {
        const data = await Returns.find({ _id: req.params.id });

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

const createReturn = async (req, res) => {
    try {
        if (!req.body.description) {
            return res.status(404).json({
                message: "All filed is required",
            });
        }
        const data = new Returns({
            description: req.body.description,
            banglaDescription: req.body.banglaDescription,
        });
        await data.save();

        res.status(200).json({
            message: "Success fully added Returns",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "There was a server side error",
        });
    }
};
//  update single Returns
const updateSingleReturn = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(404).json({
                message: "Id is required",
            });
        }
        await Returns.findByIdAndUpdate(
            { _id: req.params.id },
            {
                $set: req.body,
            },
            {
                new: true,
            }
        );

        res.status(200).json({
            message: "Success fully updated Returns",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "There was a server side error",
        });
    }
};

// delete Returns
const deleteSingleReturn = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(404).json({
                message: "Id is required",
            });
        }
        await Returns.deleteOne({
            _id: req.params.id,
        });

        res.status(200).json({
            message: "Success fully added Returns",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "There was a server side error",
        });
    }
};

// Delete all Returns
const deleteAllReturns = async (req, res) => {
    try {
        await Returns.deleteMany({});

        res.status(200).json({
            message: "Success fully deleted all Returns",
        });
    } catch (error) {
        res.status(500).json({
            message: "There was a server side error",
        });
    }
};

module.exports = {
    getAllReturns,
    createReturn,
    getSingleReturn,
    deleteSingleReturn,
    deleteAllReturns,
    updateSingleReturn,
};
