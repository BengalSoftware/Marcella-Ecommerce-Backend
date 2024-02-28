const { transport } = require("../config/mailTransport");
const Address = require("../models/address.model");
const cart = require("../models/cart.model");
const Order = require("../models/order.model");
const Product = require("../models/product.model");
const User = require("../models/user.model");
require("dotenv").config();

// DONE - GET ALL ORDERS
const getOrders = async (req, res) => {
    try {
        const qStatus = req.query.status;

        // take an filter empty array to push all filters
        const filterArr = [];
        if (qStatus) {
            filterArr.push({ status: { $regex: qStatus, $options: "i" } });
        } else {
            // initially status pending
            filterArr.push({ status: "pending" });
        }

        // take empty object to calculate page and limit
        let queries = {};
        // page calculation

        const { page = 1, limit = 25 } = req.query || {};
        const skip = (page - 1) * parseInt(limit);
        queries.skip = skip;
        queries.limit = parseInt(limit);

        // final searching
        const data = await Order.find({ $and: filterArr })
            .skip(queries.skip)
            .limit(queries.limit)
            .populate("user")
            .populate("report")
            .exec();

        // pages calculation
        const totalOrders = await Order.countDocuments({ $and: filterArr });
        // const totalProductsByFilter = await Product.countDocuments(filters);
        const totalPageNumber = Math.ceil(totalOrders / queries.limit);

        res.status(200).json({
            data,
            totalPageNumber,
            totalOrders,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: "There was a server side error!",
        });
    }
};

// DONE - FILTER ORDER
const filterOrder = async (req, res) => {
    try {
        const qName = req.query.name;
        const qOrderId = req.query.orderId;
        const qPrice = req.query.price;
        const qDate = req.query.date;
        const qMethod = req.query.method;
        const qShippingPhone = req.query.shippingPhone;
        const qEmail = req.query.email;

        const filterArr = [];

        if (qMethod) {
            filterArr.push({
                paymentMethod: { $regex: qMethod, $options: "i" },
            });
        }

        if (qName) {
            filterArr.push({
                userName: {
                    $regex: qName,
                    $options: "i",
                },
            });
        }

        if (qOrderId)
            filterArr.push({
                orderId: {
                    $regex: qOrderId,
                    $options: "i",
                },
            });
        if (qPrice) filterArr.push({ totalAmount: qPrice });

        if (qDate)
            filterArr.push({
                createdAt: {
                    $gte: new Date(qDate + "T00:00:00.000Z"),
                    $lte: new Date(qDate + "T12:59:59.000Z"),
                },
            });

        if (qShippingPhone)
            filterArr.push({
                userPhone: qShippingPhone,
            });
        let orderInfo = {};
        if (qEmail) {
            const user = await User.findOne({ email: qEmail }).exec();
            const filter = {};
            filter.user = user._id;
            orderInfo.user = user;
            orderInfo.data = await Order.aggregate([
                {
                    $match: filter,
                },
                {
                    $group: {
                        _id: null,
                        totalSales: { $sum: "$totalAmount" },
                        totalShipping: { $sum: "$shippingCharge" },
                        totalOrders: { $sum: 1 },
                        // orders: { $push: "$$ROOT" }, // all orders on an array
                    },
                },
            ]);

            filterArr.push({
                user: user._id,
            });
        }

        // take empty object to calculate page and limit
        let queries = {};
        // page calculation

        const { page = 1, limit = 25 } = req.query || {};
        const skip = (page - 1) * parseInt(limit);
        queries.skip = skip;
        queries.limit = parseInt(limit);

        // final searching
        const data = await Order.find({ $and: filterArr })
            .skip(queries.skip)
            .limit(queries.limit)
            .populate("user")
            .populate("report")
            .exec();

        // pages calculation
        const totalOrders = await Order.countDocuments({ $and: filterArr });
        // const totalProductsByFilter = await Product.countDocuments(filters);
        const totalPageNumber = Math.ceil(totalOrders / queries.limit);

        res.status(200).json({
            data,
            totalPageNumber,
            totalOrders,
            orderInfo,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: "There was a server side error!",
        });
    }
};

// DONE - GET RECENT ORDERS
const getRecentOrder = async (req, res) => {
    try {
        const data = await Order.find({})
            .populate("user products.product address")
            .sort({ createdAt: -1 })
            .limit(5);

        res.status(200).json(data);
    } catch {
        res.status(500).json({
            error: "There was a server side error!",
        });
    }
};

// DONE - GET TOTAL SALES (delivered only) -ADMIN
const getTotalSale = async (req, res) => {
    try {
        const data = await Order.aggregate([
            { $match: { status: "delivered" } },
            { $match: {} },
            { $group: { _id: null, totalSales: { $sum: "$totalAmount" } } },
        ]);
        res.status(200).json(data[0]);
    } catch {
        res.status(500).json({
            error: "There was a server side error!",
        });
    }
};

// DONE - GET TOTAL SALES (delivered only) -ADMIN
const getTotalSaleByDate = async (req, res) => {
    try {
        const { fromDate, toDate } = req.body || {};
        const filter = {};

        if (fromDate && toDate) {
            filter.createdAt = {
                $gte: new Date(fromDate + "T00:00:00.000Z"),
                $lte: new Date(toDate + "T12:59:59.000Z"),
            };
        }

        const data = await Order.aggregate([
            {
                $match: filter,
            },
            {
                $group: {
                    _id: null,
                    totalSales: { $sum: "$totalAmount" },
                    totalShipping: { $sum: "$shippingCharge" },
                    totalOrders: { $sum: 1 },
                    orders: { $push: "$$ROOT" }, // all orders on an array
                },
            },
        ]);

        console.log(data);
        res.status(200).json(data[0]);
    } catch {
        res.status(500).json({
            error: "There was a server side error!",
        });
    }
};

// GET TOTAL ORDERS AMOUNT -> ADMIN
const getTotalOrders = async (req, res) => {
    try {
        const data = await Order.aggregate([
            { $match: {} },
            { $group: { _id: null, totalOrders: { $sum: 1 } } },
        ]);
        res.status(200).json(data[0]);
    } catch {
        res.status(500).json({
            error: "There was a server side error!",
        });
    }
};

// GET TOTAL SALES BY PER DAY -> ADMIN
const getTotalSaleByDay = async (req, res) => {
    try {
        const data = await Order.aggregate([
            // Step 1 =>  here i am calculate $project by day, month, year for get data by year, mont, day, 1) project day, month, year, 2) project only totalAmount which is already have on all orders schema. (প্রজেক্ট করে যে সব ডাটা চাইবো তা পরের স্টেইজে যাবে, সো আমার দরকার year, month, day এবং টোটাল এমাউন্ট , which is need it's value : 1,)
            {
                $project: {
                    day: { $dayOfMonth: "$createdAt" },
                    month: { $month: "$createdAt" },
                    year: { $year: "$createdAt" },
                    totalAmount: 1,
                },
            },

            // Step 2 => here i am filter data which is only current mont (By default new Date().getMonth() will count from 0 , so here calculate 0 + 1 => exact month)
            {
                $match: { month: new Date().getMonth() + 1 },
            },

            // Step 3 => here i am group by day, month, year which is get from step one , and group by _id: {day: "$day", month: "$month", year: "$year"} to get data by day, mont, year wise and totalSale: { $sum: "$totalAmount" } for get total by year (এই স্টেজে আমি ডাটা গুলো ইয়ার অনুযায়ী পেয়েছি, এবং গ্রুফ করেছি আইডি দিয়ে(মেন্ডটরি) totalSale: ফিল্ডে $sum: "$totalAmount" করে টোটাল পেয়ে গেছি )
            {
                $group: {
                    _id: { day: "$day", month: "$month", year: "$year" },
                    total: { $sum: "$totalAmount" },
                },
            },
            // step 4 => finally sort data by day month year and this is final result
            { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
        ]);

        // send
        res.status(200).json(data);
    } catch {
        res.status(500).json({
            error: "There was a server side error!",
        });
    }
};

// GET TOTAL ORDERS BY PER DAY -> ADMIN
const getTotalOrdersByDay = async (req, res) => {
    try {
        const data = await Order.aggregate([
            {
                $project: {
                    day: { $dayOfMonth: "$createdAt" },
                    month: { $month: "$createdAt" },
                    year: { $year: "$createdAt" },
                },
            },

            {
                $match: { month: new Date().getMonth() + 1 },
            },

            {
                $group: {
                    _id: { day: "$day", month: "$month", year: "$year" },
                    total: { $sum: 1 }, // total Orders
                },
            },
            // step 4 => finally sort data by day month year and this is final result
            { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
        ]);

        // send
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({
            error: "There was a server side error!",
        });
    }
};

// GET TOTAL SALES BY MONTH -> ADMIN
const getTotalSaleByMonth = async (req, res) => {
    try {
        const data = await Order.aggregate([
            // Step 1 =>  here i am calculate $project by month, year for get data by year, mont; <-!!-> i) project by month, year, ii) project only totalAmount which is already have on all orders schema. (প্রজেক্ট করে যে সব ডাটা চাইবো তা পরের স্টেইজে যাবে, সো আমার দরকার ইয়ার, month এবং টোটাল এমাউন্ট , which is need it's value : 1,)
            {
                $project: {
                    month: { $month: "$createdAt" },
                    year: { $year: "$createdAt" },
                    totalAmount: 1,
                },
            },

            // Step 2 => here i am filter data which is only current year (By default new Date().getFullYear() will return current year)
            {
                $match: { year: new Date().getFullYear() },
            },

            // Step 3 => here i am group by  month, year which is get from step one , and group by _id: { month: "$month", year: "$year"} to get data by month, year wise and totalSale: { $sum: "$totalAmount" } for get total by year (এই স্টেজে আমি ডাটা গুলো year, month অনুযায়ী পেয়েছি, এবং গ্রুফ করেছি আইডি দিয়ে(মেন্ডটরি) totalSale: ফিল্ডে $sum: "$totalAmount" করে টোটাল পেয়ে গেছি )
            {
                $group: {
                    _id: { month: "$month", year: "$year" },
                    total: { $sum: "$totalAmount" },
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

// GET TOTAL ORDER BY MONTH -> ADMIN
const getTotalOrdersByMonth = async (req, res) => {
    try {
        const data = await Order.aggregate([
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

// GET TOTAL SALES BY YEAR -> ADMIN
const getTotalSaleByYear = async (req, res) => {
    try {
        const data = await Order.aggregate([
            {
                // Step 1 =>  here i am calculate $project by year for decorate data by year , 1) project only year, 2) project only totalAmount which is already have on all orders schema. (প্রজেক্ট করে যে সব ডাটা চাইবো তা পরের স্টেইজে যাবে, সো আমার দরকার ইয়ার এবং টোটাল এমাউন্ট)
                $project: {
                    year: { $year: "$createdAt" },
                    totalAmount: 1,
                },
            },

            // Step 2 => here i am group by date which is get from step one , and group by _id: {year: "$year"} to get data by year wise and totalSale: { $sum: "$totalAmount" } for get total by year (এই স্টেজে আমি ডাটা গুলো ইয়ার অনুযায়ী পেয়েছি, এবং গ্রুফ করেছি আইডি দিয়ে(মেন্ডটরি) totalSale: ফিল্ডে $sum: "$totalAmount" করে টোটাল পেয়ে গেছি )
            {
                $group: {
                    _id: { year: "$year" },
                    total: { $sum: "$totalAmount" }, // totalSale
                },
            },

            // Step 3 => here i sort data by {$sort: {"_id.year": 1}} which is get from step 2, and this is final result
            { $sort: { "_id.year": 1 } },
        ]);

        // send client
        res.status(200).json(data);
    } catch {
        res.status(500).json({
            error: "There was a server side error!",
        });
    }
};

// GET TOTAL ORDERS BY YEAR -> ADMIN
const getTotalOrdersByYear = async (req, res) => {
    try {
        const data = await Order.aggregate([
            {
                $project: {
                    year: { $year: "$createdAt" },
                    totalAmount: 1,
                },
            },

            {
                $group: {
                    _id: { year: "$year" },
                    total: { $sum: 1 }, // total orders
                },
            },

            // Step 3 => here i sort data by {$sort: {"_id.year": 1}} which is get from step 2, and this is final result
            { $sort: { "_id.year": 1 } },
        ]);

        // send client
        res.status(200).json(data);
    } catch {
        res.status(500).json({
            error: "There was a server side error!",
        });
    }
};

// DONE - Get order based on status
const getOrdersOnStatus = async (req, res) => {
    try {
        await Order.find({ status: req.params.status });

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({
            error: "There was a server side error!",
        });
    }
};

// GET ALL ORDERS by USER EMAIL -> CLIENT + ADMIN
const getOrdersByUserId = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email });

        const { status, limit = 25 } = req.query || {};
        const filterArr = [];
        if (status === "cancelled") filterArr.push({ status: "cancelled" });
        if (status === "returned") filterArr.push({ status: "returned" });

        if (status === "all") filterArr.push({
            status: { $nin: ['cancelled', "returned"] },
        })
        if (user) filterArr.push({ user: user?._id });

        const data = await Order.find({ $and: filterArr })
            // .limit(limit)
            .sort({ createdAt: -1 })
            .populate("products.product")
            .populate("report")
            .populate("couponDiscount");

        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({
            error: "There was a server side error!",
        });
    }
};

// GET SINGLE ORDER by ID + ADMIN
const getOrder = async (req, res) => {
    try {
        const data = await Order.findOne({ _id: req.params.id }).populate(
            "address products.product user couponDiscount"
        );

        res.status(200).json({
            result: data,
            message: "Success",
        });
    } catch (err) {
        res.status(500).json({
            error: "There was a server side error!",
        });
    }
};

// CREATE SINGLE ORDER -> CLIENT
const createOrder = async (req, res) => {
    try {
        const dbUser = await User.findOne({ email: req.params.email });
        const userId = dbUser._id.toString();
        const activeAddress = await Address.findOne({
            user: userId,
            selected: true,
        });
        let newAddressData = activeAddress._id;

        const userCart = await cart
            .findOne({ user: userId })
            .populate("couponDiscount");

        if (!userCart) {
            return res.status(404).send({ message: "User cart is empty!!" });
        }

        // Create a new order id
        const randomNum = Math.floor(Math.random() * 1000000);
        const uniqueId = `MDL${randomNum}`;

        const fullOrder = {
            user: userCart.user,
            products: userCart.products,
            couponDiscount: userCart.couponDiscount,
            address: newAddressData,
            userPhone: activeAddress.shippingPhone,
            userName: activeAddress.shippingName,
            // userEmail: activeAddress.shippingEmail,
            discountAmount: req.body?.discountAmount || undefined,
            status: req.body?.status,
            paymentType: req.body?.paymentType,
            totalAmount: req.body?.totalAmount,
            shippingCharge: req.body?.shippingCharge,
            orderId: uniqueId,
        };
        // this two filed include for ssl commerz payment
        if (req.body.paymentMethod)
            fullOrder.paymentMethod = req.body.paymentMethod;
        if (req.body.transactionId)
            fullOrder.transactionId = req.body.transactionId;

        // user model update
        if (userCart?.couponDiscount)
            dbUser.usedCoupons.push(userCart.couponDiscount._id.toString());
        dbUser.orderCompletion += 1;

        const newOrder = await new Order(fullOrder);
        await newOrder.save();
        await dbUser.save();

        await cart.deleteOne({ user: userId });

        res.status(200).send({ message: "Orders placed successfully!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "There was a server side error!",
        });
    }
};

// CREATE MULTIPLE ORDERS
const createOrders = async (req, res) => {
    await Order.insertMany(req.body, (err) => {
        if (err) {
            res.status(500).json({
                error: "There was a server side error!",
            });
        } else {
            res.status(200).json({
                message: "All Orders added successfully!",
            });
        }
    });
};

// UPDATE SINGLE ORDER
const updateOrder = async (req, res) => {
    try {
        // order id
        if (!req.params.id || !req.body.status) {
            return res.status(400).json({ message: "All field are required" });
        }

        //updated warehouse product based on order status
        await updateDatabaseProductQuantity(
            req.params.id,
            req.body.status,
            req.body.notify,
            res
        );

        // if notify then user will get an email
        if (req.body.html) {
            const { name, to, html, status } = req.body;
            let mailOptions = {
                from: process.env.EMAIL_FROM,
                to: [to],
                subject: `Hello ${name}! Your Order is ${status}`,
                text: `Order Status!`,
                html: html,
            };
            // send mail on transporter
            await transport.sendMail(mailOptions);
        }

        res.status(200).json({
            message: "Order updated successfully!",
        });
    } catch (error) {
        res.status(500).json({
            error: "There was a server side error!",
        });
    }
};

// UPDATE MULTIPLE ORDERS

// DELETE SINGLE ORDER
const deleteOrder = async (req, res) => {
    await Order.deleteOne({ _id: req.params.id }, (err) => {
        if (err) {
            res.status(500).json({
                error: "There was a server side error!",
            });
        } else {
            res.status(200).json({
                message: "Order has been deleted successfully!",
            });
        }
    }).clone();
};

// Helper function to calculate quantity adjustment based on current and new status
function calculateQuantityAdjustment(currentStatus, newStatus) {
    if (
        currentStatus === "pending" &&
        (newStatus === "processing" ||
            newStatus == "delivered" ||
            newStatus == "shipped")
    ) {
        // Decrease quantity for processing, shipped, or delivered orders
        return -1;
    } else if (
        (currentStatus === "cancelled" ||
            currentStatus === "returned" ||
            currentStatus === "expired") &&
        (newStatus === "processing" ||
            newStatus == "shipped" ||
            newStatus == "delivered")
    ) {
        // Decrease quantity for new status as processing
        return -1;
    } else if (
        (currentStatus === "processing" ||
            currentStatus === "delivered" ||
            currentStatus === "shipped") &&
        (newStatus === "cancelled" ||
            newStatus === "returned" ||
            newStatus === "expired" ||
            newStatus === "pending")
    ) {
        // Increase quantity for new status as processing
        return 1;
    } else {
        // No quantity adjustment for other cases
        return 0;
    }
}

// helper function for update database 
async function updateDatabaseProductQuantity(
    orderId,
    orderStatus,
    notify,
    res
) {
    const newStatus = orderStatus.toLowerCase();
    try {
        const order = await Order.findById(orderId).populate(
            "products.product"
        );
        // Calculate the current status and quantity adjustment
        const currentStatus = order.status;
        const quantityAdjustment = calculateQuantityAdjustment(
            currentStatus.toLowerCase(),
            newStatus
        );

        // Update the order status
        order.status = newStatus;
        order.notify = notify;

        // Update the product quantities
        for (const orderProduct of order.products) {
            const { product, quantity } = orderProduct;

            const adjustedQuantity = quantityAdjustment * quantity;
            const totalQuantity = await Product.findById(product._id).select(
                "quantity"
            );

            if (adjustedQuantity > totalQuantity) {
                return res.status(400).json({
                    message: "Total quantity is less than ordered quantity.",
                });
            } else {
                await Product.findByIdAndUpdate(product._id, {
                    $inc: { quantity: adjustedQuantity },
                });
            }
        }
        await order.save();
        return;
    } catch (error) {
        console.error("Error updating order status:", error);
    }
}


module.exports = {
    getOrder,
    filterOrder,
    getRecentOrder,
    getOrdersByUserId,
    getOrdersOnStatus,
    getTotalSaleByDate,
    getOrders,
    createOrder,
    createOrders,
    updateOrder,
    deleteOrder,
    getTotalSale,
    getTotalOrders,
    getTotalSaleByDay,
    getTotalOrdersByDay,
    getTotalSaleByYear,
    getTotalSaleByMonth,
    getTotalOrdersByMonth,
    getTotalOrdersByYear,
};
