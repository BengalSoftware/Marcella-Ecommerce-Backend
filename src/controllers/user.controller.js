const User = require("../models/user.model");
const userGroupModel = require("../models/userGroup.model");
const cloudinary = require("../config/cloudinary");

const fs = require("fs");

// DONE - GET ALL USERS -> ADMIN
const getAllUsers = async (req, res) => {
    try {
        const qStatus = req.query.status;
        const qName = req.query.name;
        const qDate = req.query.date;
        const qEmail = req.query.email;
        const qPhone = req.query.phone;

        const filterArr = [];

        if (qStatus) {
            filterArr.push({ groupName: { $regex: qStatus, $options: "i" } });
        } else {
            // initially status pending
            filterArr.push({ groupName: "Default" });
        }
        if (qName) filterArr.push({ name: { $regex: qName, $options: "i" } });
        if (qEmail) filterArr.push({ email: qEmail });
        if (qPhone) filterArr.push({ phone: qPhone });
        if (qDate)
            filterArr.push({
                createdAt: {
                    $gte: new Date(qDate + "T00:00:00.000Z"),
                    $lte: new Date(qDate + "T12:59:59.000Z"),
                },
            });

        // take empty object to calculate page and limit
        let queries = {};
        // page calculation

        const { page = 1, limit = 25 } = req.query || {};
        const skip = (page - 1) * parseInt(limit);
        queries.skip = skip;
        queries.limit = parseInt(limit);

        const data = await User.find({ $and: filterArr })
            .limit(queries.limit)
            .skip(queries.skip);

        const totalOrders = await User.countDocuments({ $and: filterArr });
        // const totalProductsByFilter = await Product.countDocuments(filters);
        const totalPageNumber = Math.ceil(totalOrders / queries.limit);

        res.status(200).json({
            result: { data, totalPageNumber, totalOrders },
            message: "Success",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: "There was a server side error!",
        });
    }
};

// GET TOTAL ORDERS
const getTotaLUsers = async (req, res) => {
    try {
        const data = await User.aggregate([
            { $match: {} },
            { $group: { _id: null, totalUsers: { $sum: 1 } } },
        ]);
        res.status(200).json(data[0]);
    } catch {
        res.status(500).json({
            error: "There was a server side error!",
        });
    }
};

// GET USER BY MONTH -> ADMIN
const getTotalUsersByMonth = async (req, res) => {
    try {
        const data = await User.aggregate([
            {
                $project: {
                    month: { $month: "$createdAt" },
                    year: { $year: "$createdAt" },
                },
            },

            {
                $match: { year: new Date().getFullYear() },
            },

            {
                $group: {
                    _id: { month: "$month", year: "$year" },
                    total: { $sum: 1 },
                },
            },

            // step 4 =>  sort data by year and month and it's
            { $sort: { "_id.year": 1, "_id.month": 1 } },

            // step 5 => to get month name against number of months
            {
                $addFields: {
                    month: {
                        $let: {
                            vars: {
                                monthsInString: [
                                    ,
                                    "Jan",
                                    "Feb",
                                    "Mar",
                                    "Apr",
                                    "May",
                                    "Jun",
                                    "July",
                                    "Aug",
                                    "Sep",
                                    "Oct",
                                    "Nov",
                                    "Dec",
                                ],
                            },
                            in: {
                                $arrayElemAt: [
                                    "$$monthsInString",
                                    "$_id.month",
                                ],
                            },
                        },
                    },
                },
            },
        ]);

        // send
        res.status(200).json(data);
    } catch {
        res.status(500).json({
            error: "There was a server side error!",
        });
    }
};

// GET SINGLE USER by ID
const getUser = async (req, res) => {
    await User.findOne({ _id: req.params.id }, (err, data) => {
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

// GET SINGLE USER by EMAIL
const getUserByEmail = async (req, res) => {
    try {
        const data = await User.findOne({ email: req.params.email });
        const group = await userGroupModel.findOne({
            groupName: data.groupName,
        });
        res.status(200).json({ data, group });
    } catch (err) {
        res.status(500).json({
            error: "There was a server side error!",
        });
    }
};

// UPDATE SINGLE USER by EMAIL
const updateUser = async (req, res) => {
    try {
        const query = await User.findOne({ email: req.params.email });
        const userId = query._id;

        const path = req?.file?.path;
        const uploader = async (pathUrl) =>
            await cloudinary.uploads(pathUrl, "photoUrl");

        // call the cloudinary function and get an array of url
        let newUrl = "";
        if (path) {
            newUrl = await uploader(path);
            fs.unlinkSync(path);
        }
        const updateObject = {};
        if (req.body.name) updateObject.name = req.body.name;
        if (req.body.phone) updateObject.phone = req.body.phone;
        if (newUrl.url) updateObject.photoUrl = newUrl.url;
        console.log(updateObject);
        await User.findByIdAndUpdate(
            { _id: userId },
            {
                $set: updateObject,
            },
            {
                new: true,
                useFindAndModify: false,
            }
        );

        res.status(200).send({ message: "Profile updated successfully!" });
    } catch (err) {
        res.status(500).json({
            error: "There was a server side error!",
        });
    }
};

// TODO - UPDATE MULTIPLE USERS

// DELETE SINGLE USER
const deleteUser = async (req, res) => {
    try {
        await User.deleteOne({
            _id: req.params.id,
        });

        res.status(200).json({
            message: "User has been deleted successfully!",
        });
    } catch (error) {
        res.status(500).json({
            error: "There was a server side error!",
        });
    }
};

// TODO - DELETE ALL USERS
const deleteAllUsers = async (req, res) => {
    try {
        await User.deleteMany({});
        res.status(200).json({
            error: "All user deleted successfully!",
        });
    } catch (error) {
        res.status(500).json({
            error: "There was a server side error!",
        });
    }
};

const getReceiverEmail = async (groupName) => {
    if (groupName === "all") {
        const allUser = await User.find({});
        const receiverEmail = allUser.map((user) => user.email);
        return receiverEmail;
    } else {
        const allUser = await User.find({ groupName: groupName });

        const receiverEmail = allUser.map((user) => user.email);
        return receiverEmail;
    }
};
module.exports = {
    getAllUsers,
    getUser,
    getUserByEmail,
    updateUser,
    deleteUser,
    deleteAllUsers,
    getReceiverEmail,
    getTotaLUsers,
    getTotalUsersByMonth,
};
