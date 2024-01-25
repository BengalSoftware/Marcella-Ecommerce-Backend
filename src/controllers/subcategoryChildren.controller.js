const slugify = require("slugify");
const Subcategory = require("../models/subCategory.model");
const SubcategoryChildren = require("../models/subcategoryChildren.model");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");

// DONE - GET ALL SUBCATEGORY CHILDREN
const getSubcategoryChildren = async (req, res) => {
    try {
        const data = await SubcategoryChildren.find({}).populate({
            path: "subcategory",
            populate: {
                path: "parent",
            },
        });

        res.status(200).json({
            result: data,
            message: "Success",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: "There was a server side error!",
        });
    }
};

// DONE - GET ALL SUBCATEGORY CHILDREN
const getFilterSubcategoryChildren = async (req, res) => {
    try {
        const { parent } = req.query;
        let data = [];
        if (parent) {
            data = await SubcategoryChildren.find({
                subcategory: parent,
            }).populate({
                path: "subcategory",
                populate: {
                    path: "parent",
                },
            });
        }

        res.status(200).json({
            result: data,
            message: "Success",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: "There was a server side error!",
        });
    }
};

// DONE - GET ALL CATEGORIES
const getSubCategoriesByPage = async (req, res) => {
    try {
        const qTitle = req.query.title;

        const filterArr = [];
        if (qTitle)
            filterArr.push({
                title: {
                    $regex: qTitle,
                    $options: "i",
                },
            });

        // page calculation
        const queries = {};
        const { page = 1, limit = 30 } = req.query || {};
        const skip = (page - 1) * parseInt(limit);
        queries.skip = skip;
        queries.limit = parseInt(limit);

        let subcategoryChild = [];

        if (filterArr?.length > 0) {
            subcategoryChild = await SubcategoryChildren.find({
                $and: filterArr,
            })
                .skip(queries.skip)
                .limit(queries.limit)
                .populate({
                    path: "subcategory",
                    populate: {
                        path: "parent",
                    },
                });
        } else {
            subcategoryChild = await SubcategoryChildren.find({})
                .skip(queries.skip)
                .limit(queries.limit)
                .populate({
                    path: "subcategory",
                    populate: {
                        path: "parent",
                    },
                });
        }

        const totalChildCategories = await SubcategoryChildren.countDocuments(
            {}
        );
        const totalPageNumber = Math.ceil(totalChildCategories / queries.limit);

        res.status(200).json({
            result: subcategoryChild,
            totalChildCategories,
            totalPageNumber,
            message: "Successfully get categories",
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: "There was a server side error!",
        });
    }
};

// DONE - GET ALL NICHE CATEGORY CHILDREN
const getAllNicheCategory = async (req, res) => {
    try {
        const data = await SubcategoryChildren.find({ nicheCategory: true });

        res.status(200).json({
            result: data,
            message: "Success",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: "There was a server side error!",
        });
    }
};

// COMPLETE - GET SINGLE SUBCATEGORY CHILD by ID
const getSubcategoryChild = async (req, res) => {
    try {
        const data = await SubcategoryChildren.findOne({ _id: req.params.id });

        res.status(200).json({
            result: data,
            message: "Success",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: "There was a server side error!",
        });
    }
};

// COMPLETE - CREATE SINGLE SUBCATEGORY CHILD
const createSubcategoryChild = async (req, res) => {
    try {
        if (!req.body.subcategory) {
            return res.status(400).json({ message: "Sub category is missing" });
        }
        const isExist = await SubcategoryChildren.findOne({
            title: req.body.title,
        });
        if (isExist) {
            return res.status(400).json({
                message: "This sub category child already exists",
            });
        }
        let path = null;
        if (req.file) path = req.file.path;
        const uploader = async (pathUrl) =>
            await cloudinary.uploads(pathUrl, "SubCategoryChild");

        // call the cloudinary function and get an array of url
        let newUrl = null;
        if (path) {
            newUrl = await uploader(path);
            fs.unlinkSync(path);
        }
        const updateObject = {};
        if (req.body.title) updateObject.title = req.body.title;
        if (req.body.description)
            updateObject.description = req.body.description;
        if (newUrl?.url) updateObject.image = newUrl.url;
        if (req.body.title) updateObject.slug = slugify(req.body.title.replace(/'/g, ''), {
            lower: true,
        });
        if (req.body.subcategory)
            updateObject.subcategory = req.body.subcategory;
        if (req.body.nicheCategory)
            updateObject.nicheCategory = req.body.nicheCategory;
        if (req.body.nicheTitle) updateObject.nicheTitle = req.body.nicheTitle;

        const newSubcategoryChild = new SubcategoryChildren(updateObject);
        const data = await newSubcategoryChild.save();

        // update subcategory
        await Subcategory.updateOne(
            {
                _id: req.body.subcategory,
            },
            {
                $push: {
                    children: data._id,
                },
            }
        );
        res.status(200).json({
            message: "Subcategory Child created successfully!",
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: err + "There was a server side error!",
        });
    }
};

// TODO - CREATE MULTIPLE SUBCATEGORIES

// COMPLETE - UPDATE SINGLE SUBCATEGORY
const updateSubcategoryChild = async (req, res) => {
    try {
        let path = null;
        if (req.file) path = req.file.path;
        const uploader = async (pathUrl) =>
            await cloudinary.uploads(pathUrl, "SubCategoryChild");

        // call the cloudinary function and get an array of url
        let newUrl = null;
        if (path) {
            newUrl = await uploader(path);
            fs.unlinkSync(path);
        }

        const updateObject = {};
        if (req.body.title) updateObject.title = req.body.title;
        if (req.body.description)
            updateObject.description = req.body.description;
        if (newUrl?.url) updateObject.image = newUrl.url;
        if (req.body.subcategory)
            updateObject.subcategory = req.body.subcategory;
        if (req.body.nicheCategory)
            updateObject.nicheCategory = req.body.nicheCategory;
        if (req.body.nicheTitle) updateObject.nicheTitle = req.body.nicheTitle;

        if (req.body.title) updateObject.slug = slugify(req.body.title.replace(/'/g, ''), {
            lower: true,
        });


        await SubcategoryChildren.findByIdAndUpdate(
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
            message: "Subcategory Child edited successfully!",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: "There was a server side error!",
        });
    }
};

// TODO - UPDATE MULTIPLE SUBCATEGORIES

// DONE - DELETE SINGLE SUBCATEGORY CHILD
const deleteSubcategoryChild = async (req, res) => {
    try {
        await SubcategoryChildren.deleteOne({ _id: req.params.id });

        res.status(200).json({
            message: "Subcategory Child has been deleted Successfully!",
        });
    } catch (error) {
        res.status(500).json({
            error: "There was a server side error!",
        });
    }
};

// DONE - DELETE ALL SUBCATEGORY CHILDREN
const deleteSubcategoryChildren = async (req, res) => {
    try {
        await SubcategoryChildren.deleteMany({});

        res.status(200).json({
            message: "All Subcategory Children has been deleted successfully!",
        });
    } catch (error) {
        res.status(500).json({
            error: "There was a server side error!",
        });
    }
};

module.exports = {
    getFilterSubcategoryChildren,
    getSubcategoryChildren,
    getSubcategoryChild,
    createSubcategoryChild,
    updateSubcategoryChild,
    deleteSubcategoryChild,
    deleteSubcategoryChildren,
    getAllNicheCategory,
    getSubCategoriesByPage,
};
