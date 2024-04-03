const slugify = require("slugify");
const Category = require("../models/category.model");
const Subcategory = require("../models/subCategory.model");

// DONE - GET ALL SUBCATEGORIES
const getSubcategories = async (req, res) => {
    try {
        const data = await Subcategory.find({}).populate("parent children");
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

// DONE - GET FILTER SUBCATEGORIES
const getFilterSubcategories = async (req, res) => {
    try {
        const { parent } = req.query || {};
        let data = [];

        if (parent !== undefined) {
            if (Array.isArray(parent)) {
                data = await Subcategory.find({ parent: { $in: parent } }).populate('parent children');
            } else {
                data = await Subcategory.find({ parent }).populate('parent children');
            }

            res.status(200).json({
                result: data,
                message: 'Success',
            });
        } else {
            res.status(400).json({
                error: 'Parent categories not provided in the request query.',
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: 'There was a server-side error!',
        });
    }

};

// COMPLETE - GET SINGLE SUBCATEGORY by ID
const getSubcategory = async (req, res) => {
    try {
        const data = await Subcategory.findOne({ _id: req.params.id });
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

// COMPLETE - CREATE SINGLE SUBCATEGORY
const createSubcategory = async (req, res) => {
    try {
        const isExist = await Subcategory.findOne({ title: req.body.title });
        if (isExist) {
            return res.status(400).json({
                message: "This sub category already exists",
            });
        }

        const subcategory = {
            title: req.body.title,
            slug: slugify(req.body.title.replace(/'/g, ''), {
                lower: true,
            }),
            description: req.body.description,
            parent: req.body.parent,
        };
        const newSubcategory = new Subcategory(subcategory);
        const data = await newSubcategory.save();
        await Category.updateOne(
            {
                _id: req.body.parent,
            },
            {
                $push: {
                    children: data._id,
                },
            }
        );
        res.status(200).json({
            message: "Subcategory created successfully!",
        });
    } catch (err) {
        res.status(500).json({
            error: "There was a server side error!",
        });
    }
};

// TODO - CREATE MULTIPLE SUBCATEGORIES

// COMPLETE - UPDATE SINGLE SUBCATEGORY
const updateSubcategory = async (req, res) => {
    try {
        const updateObject = {};
        if (req.body.title) updateObject.title = req.body.title;
        if (req.body.description)
            updateObject.description = req.body.description;

        if (req.body.parent) updateObject.parent = req.body.parent;
        if (req.body.title) updateObject.slug = slugify(req.body.title.replace(/'/g, ''), {
            lower: true,
        });

        await Subcategory.findByIdAndUpdate(
            { _id: req.params.id },
            {
                $set: updateObject,
            },
            {
                new: true,
                useFindAndModify: false,
            }
        );

        res.status(200).json({
            message: "Subcategory edited successfully!",
        });
    } catch (error) {
        res.status(500).json({
            error: "There was a server side error!",
        });
    }
};

// DONE - DELETE SINGLE SUBCATEGORY
const deleteSubcategory = async (req, res) => {
    try {
        await Subcategory.deleteOne({ _id: req.params.id });

        res.status(200).json({
            message: "Subcategory has been deleted Successfully!",
        });
    } catch (error) {
        res.status(500).json({
            error: "There was a server side error!",
        });
    }
};

// DONE - DELETE ALL SUBCATEGORIES
const deleteSubcategories = async (req, res) => {
    try {
        await Subcategory.deleteMany({});

        res.status(200).json({
            message: "All Subcategories has been deleted successfully!",
        });
    } catch (error) {
        res.status(500).json({
            error: "There was a server side error!",
        });
    }
};

module.exports = {
    getSubcategories,
    getSubcategory,
    createSubcategory,
    updateSubcategory,
    deleteSubcategory,
    deleteSubcategories,
    getFilterSubcategories,
};
