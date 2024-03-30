const FlashSaleProductOffer = require("../models/flashSaleProductDiscount.model");
const cron = require("node-cron");

// get FlashSale SALE    discount => ALL  - ADMIN
const getFlashSaleProductOffer = async (req, res) => {
    try {
        const data = await FlashSaleProductOffer.find({});
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

// CREATE FlashSale SALE DISCOUNT  - ADMIN
const createFlashSaleProductOffer = async (req, res) => {
    try {
        const offer = new FlashSaleProductOffer({
            ...req.body,
            status: "active",
        });
        const data = await offer.save();

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

// GET SINGLE FlashSale SALE DISCOUNT BY ID -> ADMIN
const getSingleFlashSaleProductOffer = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await FlashSaleProductOffer.findOne({ _id: id });

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

//ACTIVE SINGLE BRAND OFFER  BY ID -> ADMIN
const inactiveSingleFlashSaleProductOffer = async (req, res) => {
    try {
        if (req.body.status === "active" && req.body.timeStamps === null) {
            return res.status(400).json({
                message:
                    "Your end date is expired. Please update your date and try again.",
            });
        }
        //step 1 -> update brand offer
        await FlashSaleProductOffer.findByIdAndUpdate(
            { _id: req.params.id },
            {
                $set: {
                    status: req.body.status,
                    timeStamps: req.body.timeStamps,
                },
            },
            {
                new: true,
                useFindAndModify: false,
            }
        );

        res.status(200).json({
            message: "Discount updated successfully!",
        });
    } catch (err) {
        res.status(500).json({
            message: "There was a server side error",
        });
    }
};

//UPDATE SINGLE FlashSale SALE DISCOUNT BY ID -> ADMIN
const updateSingleFlashSaleProductOffer = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(400).json({ message: "Offer id is required" });
        }

        const dbOffer = await FlashSaleProductOffer.findOne({
            _id: req.params.id,
        });

        if (new Date(req.body.startDate) > new Date(req.body.endDate)) {
            return res
                .status(400)
                .json({ message: "End date must be larger than start date." });
        }

        if (req.body.status === "active" && req.body.timeStamps === null) {
            return res.status(400).json({ message: "Your end date is expire" });
        }

        if (req.body.name) dbOffer.name = req.body.name;
        if (req.body.startDate) dbOffer.startDate = req.body.startDate;
        if (req.body.endDate) dbOffer.endDate = req.body.endDate;
        if (req.body.offerType) dbOffer.offerType = req.body.offerType;
        if (req.body.timeStamps) dbOffer.timeStamps = req.body.timeStamps;
        if (req.body.status) dbOffer.status = req.body.status;
        if (req.body.color) dbOffer.color = req.body.color;

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

//DELETE SINGLE FlashSale SALE DISCOUNT BY ID -> ADMIN
const deleteSingleFlashSaleProductOffer = async (req, res) => {
    try {
        const id = req.params.id;
        const data = await FlashSaleProductOffer.findOne({ _id: id });
        if (data.status === "active") {
            return res.status(400).json({
                message: "This offer is active",
            });
        }
        await FlashSaleProductOffer.deleteOne({ _id: id });
        res.status(200).json({
            message: "Deleted FlashSale Discount successfully!",
        });
    } catch (error) {
        res.status(500).json({
            message: "There was a server side error!",
        });
    }
};

// DELETE ALL FlashSale SALE DISCOUNT  - ADMIN
const deleteAllFlashSaleProductOffer = async (req, res) => {
    try {
        const data = await FlashSaleProductOffer.deleteMany({});
        res.status(200).json({
            message: "All FlashSale  offer deleted successfully!",
        });
    } catch (error) {
        res.status(500).json({
            message: "There was a server side error",
        });
    }
};

//schedule function for off the offer
cron.schedule("*/10 * * * * *", async () => {
    const offers = await FlashSaleProductOffer.find({});
    offers?.forEach(async (offer) => {
        const id = offer._id;
        const nowDate = new Date(Date.now()).toISOString();

        const filter = [
            { _id: id },
            { endDate: { $lt: nowDate } },
            { status: "active" },
        ];

        await FlashSaleProductOffer.findOneAndUpdate(
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
    getFlashSaleProductOffer,
    createFlashSaleProductOffer,
    deleteSingleFlashSaleProductOffer,
    updateSingleFlashSaleProductOffer,
    getSingleFlashSaleProductOffer,
    deleteAllFlashSaleProductOffer,
    inactiveSingleFlashSaleProductOffer,
};
