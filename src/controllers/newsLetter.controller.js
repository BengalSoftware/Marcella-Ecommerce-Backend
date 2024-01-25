const NewsLetter = require("../models/newsLetter.model");

const getAllNewsLetter = async (req, res) => {
    try {
        const queries = {};

        if (req.query.page || req.query.limit) {
            const { page = 1, limit = 25 } = req.query;
            const skip = (page - 1) * parseInt(limit);
            queries.skip = skip;
            queries.limit = parseInt(limit);
        } else {
            const page = 1,
                limit = 25;
            const skip = (page - 1) * parseInt(limit);
            queries.skip = skip;
            queries.limit = parseInt(limit);
        }

        const data = await NewsLetter.find()
            .sort({ createdAt: -1 })
            .limit(queries.limit)
            .skip(queries.skip);

        const totalProducts = await NewsLetter.countDocuments();
        const totalPageNumber = Math.ceil(totalProducts / queries.limit);

        res.status(200).json({
            result: { data, totalProducts, totalPageNumber },
            message: "Successfully loaded",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "There was a server side error",
        });
    }
};

// get single NewsLetter
const getSingleNewsLetter = async (req, res) => {
    try {
        const data = await NewsLetter.find({ _id: req.params.id });

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

const subscribeNewsLetter = async (req, res) => {
    try {
        if (!req.body.email) {
            return res.status(404).json({
                message: "Email is required",
            });
        }
        const isExist = await NewsLetter.findOne({ email: req.body.email });
        if (isExist) {
            return res
                .status(400)
                .json({ message: "Email is already subscribed" });
        }
        const data = new NewsLetter({
            email: req.body.email,
        });
        await data.save();

        res.status(200).json({
            message: "Success fully subscribe",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "There was a server side error",
        });
    }
};

// delete NewsLetter
const deleteSingleNewsLetter = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(404).json({
                message: "Id is required",
            });
        }
        await NewsLetter.deleteOne({
            _id: req.params.id,
        });

        res.status(200).json({
            message: "Success fully added NewsLetter",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "There was a server side error",
        });
    }
};

// Delete all NewsLetter
const deleteAllNewsLetter = async (req, res) => {
    try {
        await NewsLetter.deleteMany({});

        res.status(200).json({
            message: "Success fully deleted all NewsLetter",
        });
    } catch (error) {
        res.status(500).json({
            message: "There was a server side error",
        });
    }
};

module.exports = {
    getAllNewsLetter,
    subscribeNewsLetter,
    getSingleNewsLetter,
    deleteSingleNewsLetter,
    deleteAllNewsLetter,
};
