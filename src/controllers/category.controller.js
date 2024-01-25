const slugify = require("slugify");
const Category = require("../models/category.model");
const Subcategory = require("../models/subCategory.model");
const SubcategoryChildren = require("../models/subcategoryChildren.model");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");

// DONE - GET ALL CATEGORIES
const getCategories = async (req, res) => {
    try {
        const categories = await Category.find({})
            .populate({
                path: "children",
                populate: {
                    path: "children",
                },
            })
            .sort({ sortOrder: 1 });
        res.status(200).json({
            result: categories,
            message: "Success",
        });
    } catch (err) {
        res.status(500).json({
            error: "There was a server side error!",
        });
    }
};

// DONE - GET breadcrumb
const getBreadcrumbCategory = async (req, res) => {
    try {
        const categories = await Category.find({}).populate({
            path: "children",
            populate: {
                path: "children",
            },
        });

        let findCategory = null;
        const qCategory = req.query.category;

        if (!qCategory) {
            return res.status(200).json({
                // result: categories,
                message: "Success",
                parentCategories: [],
            });
        }

        findCategory = await Category.findOne({ slug: qCategory });

        if (!findCategory) {
            findCategory = await Subcategory.findOne({ slug: qCategory });
        }
        if (!findCategory) {
            findCategory = await SubcategoryChildren.findOne({ slug: qCategory });
        }
        const findId = findCategory?._id;

        const parentCategories = findParentCategories(categories, findId);

        res.status(200).json({
            // result: categories,
            message: "Success",
            parentCategories,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: "There was a server side error!",
        });
    }
};

// DONE - GET SINGLE CATEGORY by ID
const getCategory = async (req, res) => {
    try {
        const category = await Category.findOne({ _id: req.params.id });
        const subcategory = await Subcategory.findOne({ _id: req.params.id });
        const subcategoryChild = await SubcategoryChildren.findOne({
            _id: req.params.id,
        });
        let data = category || subcategory || subcategoryChild || null;
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

// TODO - GET CATEGORIES by QUERY PARAMS

// DONE - POST SINGLE CATEGORY
const createCategory = async (req, res) => {
    try {
        // after get url from cloudinary then work this code
        const isExist = await Category.findOne({ title: req.body.title });
        if (isExist) {
            return res.status(400).json({
                message: "This category already exists",
            });
        }
        const category = {
            title: req.body.title,
            slug: slugify(req.body.title.replace(/'/g, ''), {
                lower: true,
            }),
            description: req.body.description,

            sortOrder: req.body.sortOrder,
        };

        const newCategory = new Category(category);

        await newCategory.save();
        res.status(200).json({
            message: "Category created successfully!",
        });
    } catch (err) {
        res.status(500).json({
            message: "There was a server side error!",
        });
    }
};

// TODO - POST MULTIPLE CATEGORIES

// DONE - UPDATE SINGLE CATEGORY
const updateCategory = async (req, res) => {
    try {
        const updateObject = {};
        if (req.body.title) updateObject.title = req.body.title;
        if (req.body.description)
            updateObject.description = req.body.description;

        if (req.body.sortOrder) updateObject.sortOrder = req.body.sortOrder;

        if (req.body.title) updateObject.slug = slugify(req.body.title.replace(/'/g, ''), {
            lower: true,
        });

        await Category.findByIdAndUpdate(
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
            message: "Category edited successfully!",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: "There was a server side error!",
        });
    }
};

// TODO - UPDATE MULTIPLE CATEGORIES

// DONE - DELETE SINGLE CATEGORY
const deleteCategory = async (req, res) => {
    await Category.deleteOne({ _id: req.params.id }, (err) => {
        if (err) {
            res.status(500).json({
                error: "There was a server side error!",
            });
        } else {
            res.status(200).json({
                message: "Category has been deleted successfully!",
            });
        }
    }).clone();
};

// DONE - DELETE ALL CATEGORIES
const deleteCategories = async (req, res) => {
    await Category.deleteMany({}, (err) => {
        if (err) {
            res.status(500).json({
                error: "There was a server side error!",
            });
        } else {
            res.status(200).json({
                message: "All Categories deleted successfully!",
            });
        }
    }).clone();
};
// DONE - get any categories with description CATEGORIES
const getAnyCategoriesWithSlug = async (req, res) => {
    try {
        const { category } = req.params || {};
        const splitCategory = category?.split("-").join(" ");
        let data = {};

        data = await Category.findOne({ $or: [{ slug: category }, { title: splitCategory }] });
        if (!data) { data = await Subcategory.findOne({ $or: [{ slug: category }, { title: splitCategory }] }) };
        if (!data) { data = await SubcategoryChildren.findOne({ $or: [{ slug: category }, { title: splitCategory }] }) };


        res.status(200).json({
            message: "Success",
            description: data?.description
        });
    } catch (error) {
        res.status(500).json({
            error: "There was a server side error!",
        });
    }
};


// find categories for breadcrumb
function findParentCategories(categories, id) {
    for (let i = 0; i < categories.length; i++) {
        const category = categories[i];
        // If the current category's ID matches the target ID, return an array with only this category
        if (category._id?.toString() === id?.toString()) {
            return [{ title: category.title, _id: category._id, slug: category.slug }];
        }

        // If the current category has children, recursively search for the target ID within them
        if (category.children) {
            const childResults = findParentCategories(category.children, id);

            // If the target ID was found within the current category's children, add this category to the results array and return it
            if (childResults.length > 0) {
                return [
                    { title: category.title, _id: category._id, slug: category.slug },
                    ...childResults,
                ];
            }
        }
    }

    // If the target ID was not found within any categories, return an empty array
    return [];
}
module.exports = {
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory,
    deleteCategories,
    getBreadcrumbCategory,
    getAnyCategoriesWithSlug,
};
