const NewUserDiscount = require("../models/newUserDiscount.model");
const cron = require("node-cron");

// get new user discount  - ADMIN
const getNewUserDiscount = async (req, res) => {
    try {
        const data = await NewUserDiscount.find({});
        res.status(200).json({
            result: data,
            message: "Discount created successfully!",
        });
    } catch (err) {
        res.status(500).json({
            message: "There was a server side error",
        });
    }
};

// CREATE NEW USER DISCOUNT  - ADMIN
const createNewUserDiscount = async (req, res) => {
    try {
        // if a offer is already available for the new user then we need to return
        const isExistOffer = await NewUserDiscount.find({});

        if (isExistOffer?.length > 0) {
            return res.status(400).json({
                message: "Already have an offer on new customer",
            });
        }

        // if offer doesn't exist then create a new offer
        const newUserDiscount = new NewUserDiscount({
            ...req.body,
            status: "active",
        });
        const data = await newUserDiscount.save();

        res.status(200).json({
            result: data,
            message: "Discount created successfully!",
        });
    } catch (err) {
        res.status(500).json({
            message: "There was a server side error",
        });
    }
};

// GET SINGLE NEW USER DISCOUNT BY ID -> ADMIN
const getSingleNewUserDiscount = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await NewUserDiscount.findOne({ _id: id });
        res.status(200).json({
            result: data,
            message: "Discount loaded successfully!",
        });
    } catch (err) {
        res.status(500).json({
            message: "There was a server side error",
        });
    }
};

//UPDATE SINGLE NEW USER DISCOUNT BY ID -> ADMIN
const updateSingleNewUserDiscount = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(400).json({ message: "Offer id is required" });
        }

        if (new Date(req.body.startDate) > new Date(req.body.endDate)) {
            return res
                .status(400)
                .json({ message: "End date must be larger than start date." });
        }

        const dbOffer = await NewUserDiscount.findOne({ _id: req.params.id });

        if (req.body.status === "active" && req.body.timeStamps === null) {
            return res.status(400).json({ message: "Your end date is expire" });
        }

        if (req.body.name) dbOffer.name = req.body.name;
        if (req.body.startDate) dbOffer.startDate = req.body.startDate;
        if (req.body.endDate) dbOffer.endDate = req.body.endDate;
        if (req.body.discountType) dbOffer.discountType = req.body.discountType;
        if (req.body.discount) dbOffer.discount = req.body.discount;
        if (req.body.timeStamps) dbOffer.timeStamps = req.body.timeStamps;
        if (req.body.status) dbOffer.status = req.body.status;

        await dbOffer.save();

        res.status(200).json({
            message: "Discount updated successfully!",
        });
    } catch (err) {
        res.status(500).json({
            message: "There was a server side error",
        });
    }
};

//DELETE SINGLE NEW USER DISCOUNT BY ID -> ADMIN
const deleteSingleNewUserDiscount = async (req, res) => {
    try {
        const id = req.params.id;
        const data = await NewUserDiscount.findOne({ _id: id });
        if (data.status === "active") {
            return res.status(400).json({
                message: "This offer is active",
            });
        }
        await NewUserDiscount.deleteOne({ _id: id });
        res.status(200).json({
            message: "Deleted New User Discount successfully!",
        });
    } catch (error) {
        res.status(500).json({
            message: "There was a server side error!",
        });
    }
};

// DELETE ALL NEW USER DISCOUNT  - ADMIN
const deleteAllNewUserDiscount = async (req, res) => {
    try {
        const data = await NewUserDiscount.deleteMany({});
        res.status(200).json({
            message: "All new user offer deleted successfully!",
        });
    } catch (error) {
        res.status(500).json({
            message: "There was a server side error",
        });
    }
};

//schedule function for off the offer
cron.schedule("*/10 * * * * *", async () => {
    const offers = await NewUserDiscount.find({});
    offers.forEach(async (offer) => {
        const id = offer._id.toString();

        const nowDate = new Date(Date.now()).toISOString();

        const filter = [
            { _id: id },
            { endDate: { $lt: nowDate } },
            { status: "active" },
        ];

        await NewUserDiscount.findOneAndUpdate(
            {
                $and: filter,
            },
            {
                $set: { status: "in-active", timeStamps: "" },
            },
            {
                new: true,
                useFindAndModify: false,
            }
        );
    });
});

module.exports = {
    getNewUserDiscount,
    createNewUserDiscount,
    deleteSingleNewUserDiscount,
    updateSingleNewUserDiscount,
    getSingleNewUserDiscount,
    deleteAllNewUserDiscount,
};
