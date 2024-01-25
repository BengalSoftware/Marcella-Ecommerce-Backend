const slugify = require("slugify");
const Rules = require("../models/rules.model");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");

// DONE - GET ALL rules
const getRules = async (req, res) => {
    try {
        const rules = await Rules.find({});
        res.status(200).json({
            result: rules,
            message: "Success",
        });
    } catch (err) {
        res.status(500).json({
            error: "There was a server side error!",
        });
    }
};

// DONE - GET SINGLE Rules by ID
const getRule = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(400).json({
                message: "Id is required",
            });
        }
        const data = await Rules.findOne({ _id: req.params.id });

        res.status(200).json({
            result: data,
            message: "Success",
        });
    } catch (err) {
        res.status(500).json({
            error: "There was a server side error!",
        });
    }
};

// TODO - GET rules by QUERY PARAMS

// DONE - POST SINGLE Rules
const createRule = async (req, res) => {
    try {
        const path = req.file.path;
        const uploader = async (pathUrl) =>
            await cloudinary.uploads(pathUrl, "rules");

        // call the cloudinary function and get an array of url
        const newUrl = await uploader(path);
        fs.unlinkSync(path);

        // after get url from cloudinary then work this code
        const newData = {
            title: req.body.title,

            description: req.body.description,
            image: newUrl?.url,
        };

        const newRules = new Rules(newData);

        await newRules.save();
        res.status(200).json({
            message: "Rules created successfully!",
        });
    } catch (err) {
        res.status(500).json({
            error: "There was a server side error!",
        });
    }
};

// TODO - POST MULTIPLE rules

// DONE - UPDATE SINGLE Rules
const updateRule = async (req, res) => {
    try {
        const path = req.file.path;
        const uploader = async (pathUrl) =>
            await cloudinary.uploads(pathUrl, "rules");

        // call the cloudinary function and get an array of url
        const newUrl = await uploader(path);
        fs.unlinkSync(path);
        const existData = await Rules.findOne({ _id: req.params.id });
        await Rules.findByIdAndUpdate(
            { _id: req.params.id },
            {
                $set: {
                    title: req.body.title,
                    description: req.body.description,
                    image: newUrl?.url || existData?.image,
                },
            },
            {
                new: true,
                useFindAndModify: false,
            }
        );

        res.status(200).json({
            message: "Rules edited successfully!",
        });
    } catch (error) {
        res.status(500).json({
            error: "There was a server side error!",
        });
    }
};

// TODO - UPDATE MULTIPLE rules

// DONE - DELETE SINGLE Rules
const deleteRule = async (req, res) => {
    await Rules.deleteOne({ _id: req.params.id }, (err) => {
        if (err) {
            res.status(500).json({
                error: "There was a server side error!",
            });
        } else {
            res.status(200).json({
                message: "Rules has been deleted successfully!",
            });
        }
    }).clone();
};

// DONE - DELETE ALL rules
const deleteRules = async (req, res) => {
    await Rules.deleteMany({}, (err) => {
        if (err) {
            res.status(500).json({
                error: "There was a server side error!",
            });
        } else {
            res.status(200).json({
                message: "All rules deleted successfully!",
            });
        }
    }).clone();
};

module.exports = {
    getRules,
    getRule,
    createRule,
    updateRule,
    deleteRule,
    deleteRules,
};
