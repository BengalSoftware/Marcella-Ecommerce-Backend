const cloudinary = require("../config/cloudinary");
const fs = require("fs");
const RelatedBanner = require("../models/relatedBanner.model");
const Product = require("../models/product.model");

const getAllRelatedBanner = async (req, res) => {
    try {
        const data = await RelatedBanner.find({});

        res.status(200).json({
            message: "Top banner found successfully",
            data: data,
        });
    } catch (error) {
        res.status(500).json({
            message: "There was a server Related error",
        });
    }
};
const getSingleRelatedBanner = async (req, res) => {
    try {
        const data = await RelatedBanner.findOne({ $or: [{ slug: req.params.slug }, { _id: req.params.slug }] });

        res.status(200).json({
            message: "Top banner found successfully",
            data,
        });
    } catch (error) {
        res.status(500).json({
            message: "There was a server Related error",
        });
    }
};

const postRelatedBanner = async (req, res) => {
    try {
        // console.log(req.body);
        const path = req.file.path;
        const uploader = async (pathUrl) =>
            await cloudinary.uploads(pathUrl, "RelatedBanners");

        // call the cloudinary function and get an array of url
        const newUrl = await uploader(path);
        fs.unlinkSync(path);

        // if newUrl is found then save on the database
        const updateObject = {};
        if (newUrl?.url) updateObject.image = newUrl?.url;
        if (req.body.name) updateObject.name = req.body.name;
        if (req.body.relatedBannerName)
            updateObject.relatedBannerName = req.body.relatedBannerName;
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
            const data = new RelatedBanner(updateObject);
            await data.save();

            res.status(200).json({
                message: "Top Banner Upload Success",
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "There was an server Related error",
        });
    }
};

//update the top banner
const updateRelatedBanner = async (req, res) => {
    try {
        let newUrl = {};
        if (req.file?.path) {
            // console.log(req.body);
            const path = req.file.path;
            const uploader = async (pathUrl) =>
                await cloudinary.uploads(pathUrl, "RelatedBanners");

            // call the cloudinary function and get an array of url
            newUrl = await uploader(path);
            fs.unlinkSync(path);
        }

        const updateObject = {};
        if (newUrl?.url) updateObject.image = newUrl?.url;
        if (req.body.name) updateObject.name = req.body.name;
        if (req.body.relatedBannerName)
            updateObject.relatedBannerName = req.body.relatedBannerName;

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

        await RelatedBanner.findByIdAndUpdate(
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
            message: "Banner Upload Success",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "There was an server Related error",
        });
    }
};

const deleteSingleRelatedBanner = async (req, res) => {
    try {
        const { id } = req.params;
        await RelatedBanner.deleteOne({ _id: id });

        res.status(200).json({
            message: "Banner deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            message: "There was a server Related error",
        });
    }
};

module.exports = {
    postRelatedBanner,
    getAllRelatedBanner,
    deleteSingleRelatedBanner,
    updateRelatedBanner,
    getSingleRelatedBanner,
};
