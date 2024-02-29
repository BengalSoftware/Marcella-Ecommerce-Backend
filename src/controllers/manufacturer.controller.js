const slugify = require("slugify");
const Manufacturer = require("../models/manufacturer.model");

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
        // console.log(req.body);
        const path = req?.file?.path;
        const uploader = async (pathUrl) =>
            await cloudinary.uploads(pathUrl, "photoUrl");

        // call the cloudinary function and get an array of url
        let newUrl = "";
        if (path) {
            newUrl = await uploader(path);
            fs.unlinkSync(path);
        }
        const newManufacturer = new Manufacturer(req.body);
        const data = await newManufacturer.save();
        res.status(200).json({
            message: "Manufacturer created successfully!",
        });
    } catch (err) {
        res.status(500).json({
            error: "There was a server side error!",
        });
    }

    // try {
    //     const path = req.file.path;
    //     // Upload image to Cloudinary
    //     const result = await cloudinary.uploader.upload(path);

    //     // Clean up: remove the temporary file
    //     fs.unlinkSync(path);

    //     // Now you can use the result.url to save to your database or do whatever you want
    //     // For example, you can save the URL to your Manufacturer model

    //     const newManufacturer = new Manufacturer({
    //         ...req.body,
    //         photoUrl: result.url // assuming you have a field in your Manufacturer model to store the image URL
    //     });

    //     await newManufacturer.save();

    //     res.status(200).json({
    //         message: "Image uploaded successfully!",
    //         imageUrl: result.url
    //     });
    // } catch (err) {
    //     console.error(err);
    //     res.status(500).json({
    //         error: "There was a server side error!"
    //     });
    // }
};

// TODO - CREATE MULTIPLE MANUFACTURERS

// UPDATE SINGLE MANUFACTURER
const updateManufacturer = async (req, res) => {
    try {
        const result = await Manufacturer.findByIdAndUpdate(
            {
                _id: req.params.id,
            },
            {
                $set: req.body,
            },
            {
                new: true,
                useFindAndModify: false,
            }
        );
        res.status(200).json({
            message: "Manufacturer updated successfully!",
        });
    } catch (err) {
        res.status(500).json({
            error: "There was a server side error!",
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
