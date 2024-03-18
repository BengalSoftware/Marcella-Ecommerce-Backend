const slugify = require("slugify");
const Manufacturer = require("../models/manufacturer.model");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");

// COMPLETE - GET ALL MANUFACTURERS
const getManufacturers = async (req, res) => {
    await Manufacturer.find({}).exec((err, data) => {
        if (err) {
            res.status(500).json({
                error: "There was a server side error!",
            });
        } else {
            res.status(200).json({
                result: data,
                message: "Success",
            });
        }
    });
};

// DONE - GET SINGLE MANUFACTURER by ID
const getManufacturer = async (req, res) => {
    await Manufacturer.find({ _id: req.params.id }, (err, data) => {
        if (err) {
            res.status(500).json({
                error: "There was a server side error!",
            });
        } else {
            res.status(200).json({
                result: data,
                message: "Success",
            });
        }
    }).clone();
};

// TODO - GET MANUFACTURERS by QUERY PARAMS
// const getManufacturersByQueryParams = async (req, res) => {
// }

// DONE - CREATE SINGLE MANUFACTURER
const createManufacturer = async (req, res) => {
    try {
        let newUrl = {};
        if (req.file?.path) {
            // console.log(req.body);
            const path = req.file.path;
            const uploader = async (pathUrl) =>
                await cloudinary.uploads(pathUrl, "manufacturer");

            // call the cloudinary function and get an array of url
            newUrl = await uploader(path);
            fs.unlinkSync(path);
        }

        const addManufacturerObjects = { ...req.body };
        if (req.body.name) addManufacturerObjects.name = req.body.name;
        if (newUrl?.url) addManufacturerObjects.image = newUrl.url;

        const data = Manufacturer(addManufacturerObjects);
        await data.save();
        

        res.status(200).json({
            message: "Success fully added manufacturer",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "There was a server side error",
        });
    }
};

// TODO - CREATE MULTIPLE MANUFACTURERS

// UPDATE SINGLE MANUFACTURER
const updateManufacturer = async (req, res) => {
    try {
        const dbManufacturer = await Manufacturer.findOne({ _id: req.params.id });
        if (!req.params.id || !dbManufacturer) {
            return res.status(404).json({
                message: "Id is required/valid",
            });
        }

        let newUrl = {};
        if (req.file?.path) {
            const path = req.file.path;
            const uploader = async (pathUrl) =>
                await cloudinary.uploads(pathUrl, "manufacturer");

            // call the cloudinary function and get an array of url
            newUrl = await uploader(path);
            fs.unlinkSync(path);
        }

        
        if (req.body.name) dbManufacturer.name = req.body.name;
        if (req.body.description) dbManufacturer.description = req.body.description;
        if (newUrl?.url) dbManufacturer.image = newUrl.url;

        await dbManufacturer.save();

        res.status(200).json({
            message: "Success fully updated manufacturer",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "There was a server side error",
        });
    }
};

// TODO - UPDATE MULTIPLE MANUFACTURERS

// DONE - DELETE SINGLE MANUFACTURER
const deleteManufacturer = async (req, res) => {
    try {
        await Manufacturer.deleteOne({
            _id: req.params.id,
        });
        res.status(200).json({
            error: "Manufacturer deleted Successfully!",
        });
    } catch (err) {
        res.status(500).json({
            message: err?.message || "There was a server side error!",
        });
    }
};

// DONE - DELETE ALL MANUFACTURERS
const deleteManufacturers = async (req, res) => {
    await Manufacturer.deleteMany({}, (err) => {
        if (err) {
            res.status(500).json({
                error: "There was a server side error!",
            });
        } else {
            res.status(200).json({
                message: "All manufacturers deleted successfully!",
            });
        }
    }).clone();
};

module.exports = {
    getManufacturers,
    getManufacturer,
    createManufacturer,
    updateManufacturer,
    deleteManufacturer,
    deleteManufacturers,
};
