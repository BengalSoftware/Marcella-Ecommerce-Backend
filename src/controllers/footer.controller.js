const Footer = require("../models/footer.model");

const getAllFooter = async (req, res) => {
    try {
        const data = await Footer.find({});

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

// get single Footer
const getSingleFooter = async (req, res) => {
    try {
        const data = await Footer.find({ _id: req.params.id });

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

const createFooter = async (req, res) => {
    try {
        if (!req.body.text) {
            return res.status(404).json({
                message: "All filed is required",
            });
        }
        const exist = await Footer.find({});
        if (exist) {
            return res.status(400).json({
                message: "Already have a footer",
            });
        }

        const data = new Footer({
            text: req.body.text,
        });
        await data.save();

        res.status(200).json({
            message: "Success fully added Footer",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "There was a server side error",
        });
    }
};
//  update single Footer
const updateSingleFooter = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(404).json({
                message: "Id is required",
            });
        }
        await Footer.findByIdAndUpdate(
            { _id: req.params.id },
            {
                $set: req.body,
            },
            {
                new: true,
            }
        );

        res.status(200).json({
            message: "Success fully updated Footer",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "There was a server side error",
        });
    }
};

// delete Footer
const deleteSingleFooter = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(404).json({
                message: "Id is required",
            });
        }
        await Footer.deleteOne({
            _id: req.params.id,
        });

        res.status(200).json({
            message: "Success fully added Footer",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "There was a server side error",
        });
    }
};

// Delete all Footer
const deleteAllFooter = async (req, res) => {
    try {
        await Footer.deleteMany({});

        res.status(200).json({
            message: "Success fully deleted all Footer",
        });
    } catch (error) {
        res.status(500).json({
            message: "There was a server side error",
        });
    }
};

module.exports = {
    getAllFooter,
    createFooter,
    getSingleFooter,
    deleteSingleFooter,
    deleteAllFooter,
    updateSingleFooter,
};
