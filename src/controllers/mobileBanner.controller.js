const cloudinary = require("../config/cloudinary");
const fs = require("fs");
const MobileBannerImage = require("../models/mobileBanner.model");

const getAllMobileBanner = async (req, res) => {
    try {
        const data = await MobileBannerImage.find({});

        res.status(200).json({
            message: "Mobile banner found successfully",
            data: data,
        });
    } catch (error) {
        res.status(500).json({
            message: "There was a server side error",
        });
    }
};

const postMobileBanner = async (req, res) => {
    try {
        const path = req.file.path;
        const uploader = async (pathUrl) =>
            await cloudinary.uploads(pathUrl, "MobileBannerImage");

        // call the cloudinary function and get an array of url
        const newUrl = await uploader(path);
        fs.unlinkSync(path);

        // if newUrl is found then save on the database
        if (newUrl) {
            const data = new MobileBannerImage({
                image: newUrl.url,
            });
            await data.save();

            res.status(200).json({
                message: "Mobile Banner Upload Success",
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "There was an server side error",
        });
    }
};

const deleteSingleMobileBanner = async (req, res) => {
    try {
        const { id } = req.params;
        await MobileBannerImage.deleteOne({ _id: id });

        res.status(200).json({
            message: "Mobile banner deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            message: "There was a server side error",
        });
    }
};

module.exports = {
    postMobileBanner,
    getAllMobileBanner,
    deleteSingleMobileBanner,
};
