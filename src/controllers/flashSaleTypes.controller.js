const FlashSaleType = require("../models/flashSaleTypes.model");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");

const getAllFlashSaleType = async (req, res) => {
    try {
        const data = await FlashSaleType.find({});

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

// get single FlashSaleType
const getSingleFlashSaleType = async (req, res) => {
    try {
        const data = await FlashSaleType.find({ _id: req.params.id });

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

const createFlashSaleType = async (req, res) => {
    try {
        let newUrl = {};
        if (req.file?.path) {
            // console.log(req.body);
            const path = req.file.path;
            const uploader = async (pathUrl) =>
                await cloudinary.uploads(pathUrl, "flashtype");

            // call the cloudinary function and get an array of url
            newUrl = await uploader(path);
            fs.unlinkSync(path);
        }

        const addFlashTypeObjects = { ...req.body };
        if (req.body.name) addFlashTypeObjects.name = req.body.name;
        if (newUrl?.url) addFlashTypeObjects.image = newUrl.url;

        const data = FlashSaleType(addFlashTypeObjects);
        await data.save();
        

        res.status(200).json({
            message: "Success fully added flash sale type",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "There was a server side error",
        });
    }
};
//  update single FlashSaleType
const updateSingleFlashSaleType = async (req, res) => {
    try {
        const dbFlashSaleType = await FlashSaleType.findOne({ _id: req.params.id });
        if (!req.params.id || !dbFlashSaleType) {
            return res.status(404).json({
                message: "Id is required/valid",
            });
        }

        let newUrl = {};
        if (req.file?.path) {
            const path = req.file.path;
            const uploader = async (pathUrl) =>
                await cloudinary.uploads(pathUrl, "flashtype");

            // call the cloudinary function and get an array of url
            newUrl = await uploader(path);
            fs.unlinkSync(path);
        }

        
        if (req.body.name) dbFlashSaleType.name = req.body.name;
        if (newUrl?.url) dbFlashSaleType.image = newUrl.url;

        await dbFlashSaleType.save();

        res.status(200).json({
            message: "Success fully updated flashtype",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "There was a server side error",
        });
    }
};

// delete FlashSaleType
const deleteSingleFlashSaleType = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(404).json({
                message: "Id is required",
            });
        }
        await FlashSaleType.deleteOne({
            _id: req.params.id,
        });

        res.status(200).json({
            message: "Success fully added FlashSaleType",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "There was a server side error",
        });
    }
};

// Delete all FlashSaleType
const deleteAllFlashSaleType = async (req, res) => {
    try {
        await FlashSaleType.deleteMany({});

        res.status(200).json({
            message: "Success fully deleted all FlashSaleType",
        });
    } catch (error) {
        res.status(500).json({
            message: "There was a server side error",
        });
    }
};

module.exports = {
    getAllFlashSaleType,
    createFlashSaleType,
    getSingleFlashSaleType,
    deleteSingleFlashSaleType,
    deleteAllFlashSaleType,
    updateSingleFlashSaleType,
};
