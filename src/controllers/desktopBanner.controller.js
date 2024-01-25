const cloudinary = require("../config/cloudinary");
const fs = require("fs");
const desktopBannerImage = require("../models/desktopBanner.model");
const bottomBanner = require("../models/bottomBanner.model");
const sideBanner = require("../models/sideBanner.model");
const Product = require("../models/product.model");

// GET ALL DESKTOP BANNER
const getAllDesktopBanner = async (req, res) => {
    try {
        const data = await desktopBannerImage.find({});

        res.status(200).json({
            message: "Desktop banner found successfully",
            data: data,
        });
    } catch (error) {
        res.status(500).json({
            message: "There was a server side error",
        });
    }
};

// GET ALL BANNER NAME -> ADMIN
const getAllBannerName = async (req, res) => {
    try {
        const desktop = await desktopBannerImage.find({}, { name: 1 });
        const bottom = await bottomBanner.find({}, { name: 1 });
        const side = await sideBanner.find({}, { name: 1 });

        res.status(200).json({
            message: "Desktop banner found successfully",
            data: [...desktop, ...bottom, ...side],
        });
    } catch (error) {
        res.status(500).json({
            message: "There was a server side error",
        });
    }
};

//GET SINGLE BANNER
const getSingleBanner = async (req, res) => {
    try {
        const data = await desktopBannerImage.findOne({ $or: [{ slug: req.params.slug }, { _id: req.params.slug }] });

        res.status(200).json({
            message: "Desktop banner found successfully",
            data: data,
        });
    } catch (error) {
        res.status(500).json({
            message: "There was a server side error",
        });
    }
};

// CREATE A DESKTOP BANNER -> ADMIN
const postDesktopBanner = async (req, res) => {
    try {
        if (!req.body.categories) {
            return res.status(400).json({ message: "No categories provided" });
        }

        // console.log(req.body);
        const path = req.file.path;
        const uploader = async (pathUrl) =>
            await cloudinary.uploads(pathUrl, "desktopBannerImages");

        // call the cloudinary function and get an array of url
        const newUrl = await uploader(path);
        fs.unlinkSync(path);

        const updateObject = {};
        if (newUrl?.url) updateObject.image = newUrl?.url;
        if (req.body.name) updateObject.name = req.body.name;
        if (req.body.bannerColor)
            updateObject.bannerColor = req.body.bannerColor;
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
            const data = new desktopBannerImage(updateObject);

            await data.save();

            res.status(200).json({
                message: "Desktop Banner Upload Success",
            });
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: error.message || "There was an server side error",
        });
    }
};

//UPDATE DESKTOP BANNER -> ADMIN
const updateDesktopBanner = async (req, res) => {
    try {
        let newUrl = {};
        if (req.file?.path) {
            // console.log(req.body);
            const path = req.file.path;
            const uploader = async (pathUrl) =>
                await cloudinary.uploads(pathUrl, "desktopBannerImages");

            // call the cloudinary function and get an array of url
            newUrl = await uploader(path);
            fs.unlinkSync(path);
        }

        const updateObject = {};
        if (newUrl?.url) updateObject.image = newUrl?.url;
        if (req.body.name) updateObject.name = req.body.name;
        if (req.body.bannerColor)
            updateObject.bannerColor = req.body.bannerColor;
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

        await desktopBannerImage.findByIdAndUpdate(
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
        console.log(error);
        res.status(500).json({
            message: "There was an server side error",
        });
    }
};

// DELETE SINGLE BANNER
const deleteSingleDesktopBanner = async (req, res) => {
    try {
        const { id } = req.params;
        await desktopBannerImage.deleteOne({ _id: id });

        res.status(200).json({
            message: "Desktop banner deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            message: "There was a server side error",
        });
    }
};

module.exports = {
    postDesktopBanner,
    getAllDesktopBanner,
    deleteSingleDesktopBanner,
    updateDesktopBanner,
    getSingleBanner,
    getAllBannerName,
};
