const Product = require("../models/product.model");
const Review = require("../models/review.model");
const User = require("../models/user.model");

// DONE - GET ALL REVIEWS -> ADMIN
const getReviews = async (req, res) => {
    try {
        const queries = {};

        const { page = 1, limit = 25 } = req?.query || {};
        const skip = (page - 1) * parseInt(limit);
        queries.skip = skip;
        queries.limit = parseInt(limit);

        const data = await Review.find()
            .sort({ createdAt: -1 })
            .limit(queries.limit)
            .skip(queries.skip)
            .populate("user product");

        const totalProducts = await Review.countDocuments();
        // const totalProductsByFilter = await Product.countDocuments(filters);
        const totalPageNumber = Math.ceil(totalProducts / queries.limit);

        res.status(200).json({
            result: { data, totalProducts, totalPageNumber },
            message: "Success",
        });
    } catch (err) {
        res.status(500).json({
            error: "There was a server side error!",
        });
    }
};

// GET USER BY MONTH -> ADMIN
const getTotalReviewsByMonth = async (req, res) => {
    try {
        const data = await Review.aggregate([
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

// COMPLETE - GET ALL REVIEWS by USER EMAIL
const getReviewsByUser = async (req, res) => {
    try {
        const query = await User.findOne({ email: req.params.email });
        const userId = query._id.toString();
        const data = await Review.find({ user: userId }).populate(
            "user product"
        );
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({
            error: "There was a server side error!",
        });
    }
};

// COMPLETE - GET ALL REVIEWS by product id
const getReviewsByProductId = async (req, res) => {
    try {
        const { name } = req.params;
        const productName = name.split("-").join(" ");
        const productData = await Product.findOne({
            $or: [{ name: productName }, { slug: name }],
        });

        const data = await Review.find({
            product: productData?._id,
        }).populate("user");

        res.status(200).json(data);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: "There was a server side error!",
        });
    }
};

// DONE - GET TOTAL REVIEWS
const getTotalReviews = async (req, res) => {
    try {
        const data = await Review.aggregate([
            { $match: {} },
            { $group: { _id: null, totalReviews: { $sum: 1 } } },
        ]);
        res.status(200).json(data[0]);
    } catch {
        res.status(500).json({
            error: "There was a server side error!",
        });
    }
};

/**
 * 
 * @param {user email} req.params 
 * @param {productId, rating:number, description} req.body 
 * @returns message
 */

// COMPLETE - CREATE A REVIEW by USER EMAIL
const createReview = async (req, res) => {
    const query = await User.findOne({ email: req.params?.email });

    if (!query) {
        return res.status(400).json("User not found!");
    }
    const { product, rating, description } = req.body;
    if (!product || !rating || !description) {
        return res.status(400).json({ message: "All fields are required" });
    }
    const dbProduct = await Product.findOne({ _id: product });

    const userId = query._id.toString();

    const isAlreadyReviewed = await Review.find({
        $and: [{ user: userId }, { product: req.body.product }],
    });

    if (isAlreadyReviewed.length) {
        return res.status(400).json("Already review on this product!");
    }

    const review = {
        user: userId,
        product: product,
        description: description,
        rating: rating,
    };
    const newReview = new Review(review);

    try {
        const data = await newReview.save();

        const totalRating = dbProduct.totalRating + rating;
        const numReviews = dbProduct.numReviews + 1;

        dbProduct.totalRating = totalRating;
        dbProduct.numReviews = numReviews;
        const averageRating = (totalRating / (numReviews * 5)) * 5;

        dbProduct.averageRating = averageRating;
        dbProduct.reviews.push(data._id);

        await dbProduct.save();

        res.status(200).json({
            message: "Review added successfully!",
        });
    } catch (err) {
        res.status(500).json("There was a server side error!");
    }
};

//DONE  : - CREATE A REVIEW by USER EMAIL
const createLikeUpVote = async (req, res) => {
    const query = await User.findOne({ email: req.params?.email });
    console.log(req.body);
    if (!query) {
        return res.status(404).json("User not found!");
    }

    const userId = query._id.toString();
    try {
        // Find the review with the matching id
        const dbReview = await Review.findOne({
            _id: req.body.reviewId,
        });

        if (!dbReview) {
            return res
                .status(404)
                .json({ success: false, message: "review not found" });
        }
        // If the user has already upVoted the review, return error message

        if (
            dbReview.upVotes.some((vote) => vote.userID.toString() === userId)
        ) {
            return res.status(400).json({
                success: false,
                message: "You can not upvote more then once",
            });
        }
        // If the user is trying to upvote his own review, return error message
        if (dbReview.user.toString() === userId) {
            return res.status(400).json({
                success: false,
                message: "You can not upvote your own review",
            });
        }
        // Update the review and add the user's upvote
        await Review.findByIdAndUpdate(
            req.body.reviewId,
            { $push: { upVotes: { userID: userId } } },
            { new: true }
        );
        return res.status(200).json({
            success: true,
            message:
                "Thank you for your contribution, your response has been recorded",
        });
    } catch (err) {
        console.log(err);
        return res
            .status(500)
            .json({ success: false, message: "something went wrong" });
    }
};

// DONE - DELETE SINGLE REVIEW
const deleteReview = async (req, res) => {
    await Review.deleteOne({ _id: req.params.id }, (err) => {
        if (err) {
            res.status(500).json({
                error: "There was a server side error!",
            });
        } else {
            res.status(200).json({
                message: "Review has been deleted Successfully!",
            });
        }
    }).clone();
};

module.exports = {
    getReviews,
    getReviewsByUser,
    createReview,
    deleteReview,
    getTotalReviews,
    getReviewsByProductId,
    createLikeUpVote,
    getTotalReviewsByMonth,
};
