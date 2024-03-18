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

module.exports = {
    createStoreLayout,
    getStoreLayout
}