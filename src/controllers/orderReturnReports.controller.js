const OrderReports = require("../models/orderReturnReports.model");
const Order = require("../models/order.model");
const User = require("../models/user.model");

const getAllReports = async (req, res) => {
    try {
        const queries = {};

        const { page = 1, limit = 25 } = req?.query || {};
        const skip = (page - 1) * parseInt(limit);
        queries.skip = skip;
        queries.limit = parseInt(limit);

        const data = await OrderReports.find({})
            .sort({ createdAt: -1 })
            .limit(queries.limit)
            .skip(queries.skip);

        const totalProducts = await OrderReports.countDocuments();
        const totalPageNumber = Math.ceil(totalProducts / queries.limit);

        res.status(200).json({
            result: { data, totalProducts, totalPageNumber },
            message: "Success",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "There are server errors. Please try again",
        });
    }
};

const createReport = async (req, res) => {
    try {
        const { orderId, email, requestedFor } = req.body;
        const order = await Order.findOne({ orderId: orderId });
        const isAlreadyReport = await OrderReports.findOne({
            orderId: orderId,
        });
        const user = await User.findOne({ email: email });

        if (!order) {
            return res.status(400).json({ message: "Order id is invalid." });
        }
        if (!user) {
            return res.status(400).json({ message: "User not found." });
        }
        const orderDate = new Date(order.createdAt);

        const sevenDays = new Date(
            orderDate.getTime() + 7 * 24 * 60 * 60 * 1000
        ).toISOString();

        const nowDate = new Date(Date.now()).toISOString();

        if (order.status === "delivered" && sevenDays < nowDate) {
            return res.status(400).json({
                message:
                    "Sorry, but we are unable to process your report request as the order was placed more than 7 days ago.",
            });
        }
        if (isAlreadyReport) {
            return res
                .status(400)
                .json({ message: "You already have a report for this order." });
        }
        if (requestedFor === "return" && order.status !== "delivered") {
            return res
                .status(400)
                .json({ message: "You can't not report before delivered!" });
        }

        const newReport = new OrderReports({
            ...req.body,
            userId: user._id,
        });
        console.log(newReport);
        await Order.findByIdAndUpdate(order._id, {
            $set: {
                report: newReport._id,
            },
        });

        await newReport.save();

        res.status(200).json({
            message: "Successfully created order report.",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "There are server errors. Please try again",
        });
    }
};

const updateReport = async (req, res) => {
    try {
        const reportId = req.params.id;
        const { status } = req.body;

        const report = await OrderReports.findOne({ _id: reportId });
        if (!reportId || !report) {
            return res.status(400).json({ message: "Report id is invalid." });
        }

        report.status = status;
        await report.save();

        res.status(200).json({
            message: "Successfully updated report.",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "There are server errors. Please try again",
        });
    }
};

const getSingleReport = async (req, res) => {
    try {
        const reportId = req.params.id;

        const data = await OrderReports.findOne({ _id: reportId });

        res.status(200).json({
            message: "Successfully delete report.",
            data,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "There are server errors. Please try again",
        });
    }
};

const deleteReport = async (req, res) => {
    try {
        const reportId = req.params.id;

        await OrderReports.deleteOne({ _id: reportId });

        res.status(200).json({
            message: "Successfully delete report.",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "There are server errors. Please try again",
        });
    }
};

module.exports = {
    getAllReports,
    createReport,
    updateReport,
    deleteReport,
    getSingleReport,
};
