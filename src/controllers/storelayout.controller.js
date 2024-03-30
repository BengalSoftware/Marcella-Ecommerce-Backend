const cloudinary = require("../config/cloudinary");
const fs = require("fs");
const StoreLayout = require("../models/storelayout.model");


const createStoreLayout = async (req, res) => {
    try {
        const uploader = async (path) =>
            await cloudinary.uploads(path, "StoreLayout");

        const urls = [];
        const files = req.files;

        for (const file of files) {
            const { path } = file;

            // calll the uploader function and pass parameter a path
            const newPath = await uploader(path);
            urls.push(newPath.url);

            fs.unlinkSync(path);
        }
        if (urls) {
            const updateStoreLayoutObject = {
                ...req.body,
            };

            updateStoreLayoutObject.images = urls;

            const newStoreLayout = new StoreLayout(updateStoreLayoutObject);

            await newStoreLayout.save();

            res.status(200).json({
                message: "Store Layout created successfully!",
            });
        } else {
            res.status(400).json({
                error: "Upload failed! Check all require fields",
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: "There was a server side error!",
        });
    }
}



// get store layout 

const getStoreLayout = async (req, res) => {
    try {
        const data = await StoreLayout.find()
            .populate('products')
            .populate('layout')

        res.status(200).json({
            message: 'Success',
            data
        })
    } catch (error) {
        res.status(500).json({
            error: "There was a server side error!",
        });
    }
}



//update store layout

const updateStoreLayout = async (req, res) => {
    try {
        const dbStoreLayout = await StoreLayout.findOne({ _id: req.params.id });
        if (!req.params.id || !dbStoreLayout) {
            return res.status(404).json({
                message: "Id is required/valid",
            });
        }

        let newUrl = {};
        if (req.file?.path) {
            const path = req.file.path;
            const uploader = async (pathUrl) =>
                await cloudinary.uploads(pathUrl, "StoreLayout");

            // call the cloudinary function and get an array of url
            newUrl = await uploader(path);
            fs.unlinkSync(path);
        }

        if (req.body.layout) dbStoreLayout.layout = req.body.layout;
        if (req.body.products) dbStoreLayout.products.push(req.body.products);
        if (newUrl?.url) dbStoreLayout.images = newUrl.url;

        await dbStoreLayout.save();

        res.status(200).json({
            message: "Success fully updated store layout",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "There was a server side error",
        });
    }
}

module.exports = {
    createStoreLayout,
    getStoreLayout,
    updateStoreLayout
}