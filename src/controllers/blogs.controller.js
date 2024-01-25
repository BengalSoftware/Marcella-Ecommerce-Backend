const Blogs = require("../models/blogs.model");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");

const getAllBlogs = async (req, res) => {
    try {
        let { page = 1, limit = 20 } = req.query || {};
        const skip = (page - 1) * parseInt(limit);

        const data = await Blogs.aggregate([
            {
                $project: {
                    blogTitle: 1,
                    createdAt: 1,
                    author: 1,
                    image: 1,
                    slug: 1,
                    tags: 1,
                    description: { $substr: ["$description", 0, 200] },
                },
            },
            { $skip: skip },
            { $limit: parseInt(limit) },
        ]);

        const totalProducts = await Blogs.countDocuments();
        const totalPageNumber = Math.ceil(totalProducts / parseInt(limit));

        res.status(200).json({
            message: "Success",
            data,
            totalProducts,
            totalPageNumber,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "There was a server side error",
        });
    }
};
const getRecentBlogs = async (req, res) => {
    try {
        // const data = await Blogs.find({});
        const data = await Blogs.aggregate([
            {
                $project: {
                    blogTitle: 1,
                    createdAt: 1,
                    author: 1,
                    image: 1,
                    slug: 1,
                    tags: 1,
                    description: { $substr: ["$description", 0, 200] },
                },
            },
            {
                $sort: {
                    createdAt: -1,
                },
            },
            {
                $limit: 10,
            },
        ]);

        res.status(200).json({
            message: "Success",
            data,
        });
    } catch (error) {
        res.status(500).json({
            message: "There was a server side error",
        });
    }
};

// get single blog
const getSingleBlog = async (req, res) => {
    try {
        const data = await Blogs.findOne({ _id: req.params.id });

        if (data) {
            res.status(200).json({
                message: "Success",
                data: data,
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "There was a server side error",
        });
    }
};
// get single blog
const getSingleBlogByName = async (req, res) => {
    try {

        const data = await Blogs.findOne({ slug: req.params.slug });

        res.status(200).json({
            message: "Success",
            data: data,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "There was a server side error",
        });
    }
};

const createBlogs = async (req, res) => {
    try {
        let newUrl = {};
        if (req.file?.path) {
            // console.log(req.body);
            const path = req.file.path;
            const uploader = async (pathUrl) =>
                await cloudinary.uploads(pathUrl, "blog");

            // call the cloudinary function and get an array of url
            newUrl = await uploader(path);
            fs.unlinkSync(path);
        }

        const addBlogObject = { ...req.body };
        if (req.body.tags) addBlogObject.tags = JSON.parse(req.body.tags);
        if (newUrl?.url) addBlogObject.image = newUrl.url;

        const data = new Blogs(addBlogObject);
        await data.save();

        res.status(200).json({
            message: "Success fully added blog",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "There was a server side error",
        });
    }
};
//  update single blog
const updateSingleBlog = async (req, res) => {
    try {
        const dbBlog = await Blogs.findOne({ _id: req.params.id });
        if (!req.params.id || !dbBlog) {
            return res.status(404).json({
                message: "Id is required/valid",
            });
        }

        let newUrl = {};
        if (req.file?.path) {
            const path = req.file.path;
            const uploader = async (pathUrl) =>
                await cloudinary.uploads(pathUrl, "blog");

            // call the cloudinary function and get an array of url
            newUrl = await uploader(path);
            fs.unlinkSync(path);
        }

        console.log(req.body);
        if (req.body.author) dbBlog.author = req.body.author;
        if (req.body.description) dbBlog.description = req.body.description;
        if (req.body.blogTitle) dbBlog.blogTitle = req.body.blogTitle;
        if (req.body.slug) dbBlog.slug = req.body.slug;
        if (newUrl?.url) dbBlog.image = newUrl.url;
        if (req.body.tags) dbBlog.tags = JSON.parse(req.body.tags);

        await dbBlog.save();

        res.status(200).json({
            message: "Success fully updated blog",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "There was a server side error",
        });
    }
};

// delete blog
const deleteSingleBlog = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(404).json({
                message: "Id is required",
            });
        }
        await Blogs.deleteOne({
            _id: req.params.id,
        });

        res.status(200).json({
            message: "Success fully added blog",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "There was a server side error",
        });
    }
};

// Delete all Blogs
const deleteAllBlogs = async (req, res) => {
    try {
        await Blogs.deleteMany({});

        res.status(200).json({
            message: "Success fully deleted all blogs",
        });
    } catch (error) {
        res.status(500).json({
            message: "There was a server side error",
        });
    }
};

module.exports = {
    getAllBlogs,
    createBlogs,
    getSingleBlog,
    deleteSingleBlog,
    deleteAllBlogs,
    updateSingleBlog,
    getSingleBlogByName,
    getRecentBlogs,
};
