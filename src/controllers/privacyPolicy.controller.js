const PrivacyPolicy = require("../models/privacyPolicy.model");

const getAllPrivacy = async (req, res) => {
    try {
        const data = await PrivacyPolicy.find({});

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

// get single PrivacyPolicy
const getSinglePrivacy = async (req, res) => {
    try {
        const data = await PrivacyPolicy.find({ _id: req.params.id });

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

const createPrivacy = async (req, res) => {
    try {
        if (!req.body.description) {
            return res.status(404).json({
                message: "All filed is required",
            });
        }

        const data = new PrivacyPolicy({
            description: req.body.description,
            banglaDescription: req.body.banglaDescription,
        });

        await data.save();

        res.status(200).json({
            message: "Success fully added PrivacyPolicy",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "There was a server side error",
        });
    }
};
//  update single PrivacyPolicy
const updateSinglePrivacy = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(404).json({
                message: "Id is required",
            });
        }
        await PrivacyPolicy.findByIdAndUpdate(
            { _id: req.params.id },
            {
                $set: req.body,
            },
            {
                new: true,
            }
        );

        res.status(200).json({
            message: "Success fully updated PrivacyPolicy",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "There was a server side error",
        });
    }
};

// delete PrivacyPolicy
const deleteSinglePrivacy = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(404).json({
                message: "Id is required",
            });
        }
        await PrivacyPolicy.deleteOne({
            _id: req.params.id,
        });

        res.status(200).json({
            message: "Success fully added PrivacyPolicy",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "There was a server side error",
        });
    }
};

// Delete AllPrivacy
const deleteAllPrivacy = async (req, res) => {
    try {
        await PrivacyPolicy.deleteMany({});

        res.status(200).json({
            message: "Success fully deleted all PrivacyPolicy",
        });
    } catch (error) {
        res.status(500).json({
            message: "There was a server side error",
        });
    }
};

module.exports = {
    getAllPrivacy,
    createPrivacy,
    getSinglePrivacy,
    deleteSinglePrivacy,
    deleteAllPrivacy,
    updateSinglePrivacy,
};
