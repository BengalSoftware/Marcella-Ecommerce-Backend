const TermsConditions = require("../models/terms&condition.model");

const getAllTerms = async (req, res) => {
    try {
        const data = await TermsConditions.find({});

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

// get single TermsConditions
const getSingleTerm = async (req, res) => {
    try {
        const data = await TermsConditions.find({ _id: req.params.id });

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

const createTerm = async (req, res) => {
    try {
        if (!req.body.description) {
            return res.status(404).json({
                message: "All filed is required",
            });
        }
        const data = new TermsConditions({
            description: req.body.description,
            banglaDescription: req.body.banglaDescription,
        });
        await data.save();

        res.status(200).json({
            message: "Success fully added TermsConditions",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "There was a server side error",
        });
    }
};
//  update single TermsConditions
const updateSingleTerm = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(404).json({
                message: "Id is required",
            });
        }
        await TermsConditions.findByIdAndUpdate(
            { _id: req.params.id },
            {
                $set: req.body,
            },
            {
                new: true,
            }
        );

        res.status(200).json({
            message: "Success fully updated TermsConditions",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "There was a server side error",
        });
    }
};

// delete TermsConditions
const deleteSingleTerm = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(404).json({
                message: "Id is required",
            });
        }
        await TermsConditions.deleteOne({
            _id: req.params.id,
        });

        res.status(200).json({
            message: "Success fully added TermsConditions",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "There was a server side error",
        });
    }
};

// Delete all TermsConditions
const deleteAllTerms = async (req, res) => {
    try {
        await TermsConditions.deleteMany({});

        res.status(200).json({
            message: "Success fully deleted all TermsConditions",
        });
    } catch (error) {
        res.status(500).json({
            message: "There was a server side error",
        });
    }
};

module.exports = {
    getAllTerms,
    createTerm,
    getSingleTerm,
    deleteSingleTerm,
    deleteAllTerms,
    updateSingleTerm,
};
