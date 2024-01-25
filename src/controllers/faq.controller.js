const Faq = require("../models/faq.model");

const getAllFaq = async (req, res) => {
    try {
        const data = await Faq.find({});

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

// get single blog
const getSingleFaq = async (req, res) => {
    try {
        const data = await Faq.find({ _id: req.params.id });

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

const createFaq = async (req, res) => {
    try {
        if (!req.body.description || !req.body.title) {
            return res.status(404).json({
                message: "All filed is required",
            });
        }
        const data = new Faq({
            description: req.body.description,
            title: req.body.title,
        });
        await data.save();

        res.status(200).json({
            message: "Success fully added blog",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "There was a server side error",
        });
    }
};
//  update single blog
const updateSingleBlog = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(404).json({
                message: "Id is required",
            });
        }
        await Faq.findByIdAndUpdate(
            { _id: req.params.id },
            {
                $set: req.body,
            },
            {
                new: true,
            }
        );

        res.status(200).json({
            message: "Success fully updated blog",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "There was a server side error",
        });
    }
};

// delete blog
const deleteSingleFaq = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(404).json({
                message: "Id is required",
            });
        }
        await Faq.deleteOne({
            _id: req.params.id,
        });

        res.status(200).json({
            message: "Success fully added blog",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "There was a server side error",
        });
    }
};

// Delete all Faq
const deleteAllFaq = async (req, res) => {
    try {
        await Faq.deleteMany({});

        res.status(200).json({
            message: "Success fully deleted all Faq",
        });
    } catch (error) {
        res.status(500).json({
            message: "There was a server side error",
        });
    }
};

module.exports = {
    getAllFaq,
    createFaq,
    getSingleFaq,
    deleteSingleFaq,
    deleteAllFaq,
    updateSingleBlog,
};
