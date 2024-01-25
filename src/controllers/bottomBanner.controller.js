const cloudinary = require("../config/cloudinary");
const fs = require("fs");
const BottomBanner = require("../models/bottomBanner.model");
const Product = require("../models/product.model");

const getAllBottomBanner = async (req, res) => {
    try {
        const data = await BottomBanner.find({});

        res.status(200).json({
            message: "Bottom banner found successfully",
            data: data,
        });
    } catch (error) {
        res.status(500).json({
            message: "There was a server side error",
        });
    }
};
const getSingleBottomBanner = async (req, res) => {
    try {
        const data = await BottomBanner.findOne({ $or: [{ slug: req.params.slug }, { _id: req.params.slug }] });

        res.status(200).json({
            message: "Bottom banner found successfully",
            data,
        });
    } catch (error) {
        res.status(500).json({
            message: "There was a server side error",
        });
    }
};

const postBottomBanner = async (req, res) => {
    try {
        // console.log(req.body);
        const path = req.file.path;
        const uploader = async (pathUrl) =>
            await cloudinary.uploads(pathUrl, "BottomBanners");

        // call the cloudinary function and get an array of url
        const newUrl = await uploader(path);
        fs.unlinkSync(path);

        // if newUrl is found then save on the database
        const updateObject = {};
        if (newUrl?.url) updateObject.image = newUrl?.url;
        if (req.body.name) updateObject.name = req.body.name;
        if (req.body.related) updateObject.related = req.body.related;
        if (req.body.product) {
            updateObject.product = req.body.product;
        }
        if (req.body.slug) {
            updateObject.slug = req.body.slug;
        }

        if (req.body?.categories)
            updateObject.categories = JSON.parse(req.body.categories);

        if (req.body?.subCategories)
            updateObject.subCategories = JSON.parse(req.body.subCategories);

        if (req.body?.subCategoryChildren)
            updateObject.subCategoryChildren = JSON.parse(
                req.body.subCategoryChildren
            );
        if (newUrl) {
            const data = new BottomBanner(updateObject);

            await data.save();

            res.status(200).json({
                message: "Bottom Banner Upload Success",
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "There was an server side error",
        });
    }
};

// UPDATE BOTTOM SINGLE BANNER
const updateBottomBanner = async (req, res) => {
    try {
        let newUrl = {};
        if (req.file?.path) {
            // console.log(req.body);
            const path = req.file.path;
            const uploader = async (pathUrl) =>
                await cloudinary.uploads(pathUrl, "BottomBanners");

            // call the cloudinary function and get an array of url
            newUrl = await uploader(path);
            fs.unlinkSync(path);
        }

        const updateObject = {};
        if (newUrl?.url) updateObject.image = newUrl?.url;
        if (req.body.name) updateObject.name = req.body.name;
        // this banner related with product or category
        if (req.body.related) updateObject.related = req.body.related;
        // product means product name
        if (req.body.product) {
            updateObject.product = req.body.product;
        }
        if (req.body.slug) {
            updateObject.slug = req.body.slug;
        }
        if (req.body?.categories)
            updateObject.categories = JSON.parse(req.body.categories);

        if (req.body?.subCategories)
            updateObject.subCategories = JSON.parse(req.body.subCategories);

        if (req.body?.subCategoryChildren)
            updateObject.subCategoryChildren = JSON.parse(
                req.body.subCategoryChildren
            );

        await BottomBanner.findByIdAndUpdate(
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
            message: "Desktop Banner Upload Success",
        });
    } catch (error) {
        console.log("dsfdsfdsf", error);
        res.status(500).json({
            message: "There was an server side error",
        });
    }
};

const deleteSingleBottomBanner = async (req, res) => {
    try {
        const { id } = req.params;
        await BottomBanner.deleteOne({ _id: id });

        res.status(200).json({
            message: "Bottom banner deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            message: "There was a server side error",
        });
    }
};

module.exports = {
    postBottomBanner,
    getAllBottomBanner,
    deleteSingleBottomBanner,
    updateBottomBanner,
    getSingleBottomBanner,
};
