const Product = require("../models/product.model");
const Cart = require("../models/cart.model");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");
const FlashOffer = require("../models/flashSaleProductDiscount.model");
const Category = require("../models/category.model");
const subCategory = require("../models/subCategory.model");
const subcategoryChildren = require("../models/subcategoryChildren.model");
const desktopBanner = require("../models/desktopBanner.model");
const bottomBanner = require("../models/bottomBanner.model");
const sideBanner = require("../models/sideBanner.model");
const relatedBanner = require("../models/relatedBanner.model");
const cron = require("node-cron");

// GET ALL PRODUCTS -> CLIENT
const getProducts = async (req, res) => {
    try {
        // let filters = filtersFunction({ ...req?.query });
        const qStatus = req.query.status;
        const qCategory = req.query.category;
        const qColor = req.query.color;
        const qSize = req.query.size;
        const qSort = req.query.sort;
        const qSearch = req.query.search;
        const qPrice = req.query.price;
        const qQuantity = req.query.quantity;
        const qModel = req.query.model;
        const qDate = req.query.date;

        // queries for products
        const queries = {};
        if (qSort) {
            if (qSort === "newest") {
                queries.sortBy = { createdAt: -1 };
            } else if (qSort === "price-asc") {
                queries.sortBy = { price: 1 };
            } else if (qSort === "price-desc") {
                queries.sortBy = { price: -1 };
            }
        }

        // fields mean which filed you want such as only name and price
        // if (req.query.fields) {
        //     const field = req.query.fields.split(",").join(" ");
        //     queries.fields = field;
        // }

        // page calculation
        const { page = 1, limit = 25 } = req.query || {};
        const skip = (page - 1) * parseInt(limit);
        queries.skip = skip;
        queries.limit = parseInt(limit);

        const filterArr = []
        filterArr.push({ flashSale: false });
        if (qSearch) {
            filterArr.push({
                $or: [
                    {
                        name: {
                            $regex: qSearch,
                            $options: "i",
                        },
                    },
                    {
                        model: {
                            $regex: qSearch,
                            $options: "i",
                        },
                    },
                    { tags: { $in: qSearch } },
                ],
            });
        }
        if (qDate)
            filterArr.push({
                createdAt: {
                    $gte: new Date(qDate + "T00:00:00.000Z"),
                    $lte: new Date(qDate + "T12:59:59.000Z"),
                },
            });
        if (qCategory) {
            const modifyCategory = qCategory.split("-").join(" ");

            const category = await Category.findOne({
                $or: [{ slug: qCategory }, { title: modifyCategory }],
            }).exec();
            const subCategories = await subCategory
                .findOne({
                    $or: [{ slug: qCategory }, { title: modifyCategory }],
                })
                .exec();
            const subChildCategory = await subcategoryChildren
                .findOne({
                    $or: [{ slug: qCategory }, { title: modifyCategory }],
                })
                .exec();

            filterArr.push({
                $or: [
                    {
                        "categories._id": category?._id,
                    },
                    {
                        "subcategories._id": subCategories?._id,
                    },
                    {
                        "subcategoryChildren._id": subChildCategory?._id,
                    },
                ],
            });
        }

        if (qSize) filterArr.push({ "size.name": { $in: [qSize] } });
        if (qColor) filterArr.push({ "color.name": { $in: [qColor] } });

        if (qPrice) {
            if (qPrice.includes("-")) {
                const splitPrice = qPrice.split("-");

                filterArr.push({
                    price: { $gte: splitPrice[0], $lte: splitPrice[1] },
                });
            } else {
                filterArr.push({
                    price: qPrice,
                });
            }
        }
        if (qQuantity) filterArr.push({ quantity: qQuantity });
        if (qStatus)
            filterArr.push({
                status: {
                    $regex: qStatus,
                    $options: "i",
                },
            });
        if (qModel)
            filterArr.push({
                model: {
                    $regex: qModel,
                    $options: "i",
                },
            });

        // final filter

        if (filterArr.length === 0) {
            const data = await Product.find({ flashSale: false })
                .skip(queries.skip)
                .limit(queries.limit);

            const totalProducts = await Product.countDocuments({
                flashSale: false,
            });
            // const totalProductsByFilter = await Product.countDocuments(filters);
            const totalPageNumber = Math.ceil(totalProducts / queries.limit);

            return res.status(200).json({
                result: {
                    totalProducts,
                    totalPageNumber,
                    data,
                },
                message: "Success",
            });
        }
        const data = await Product.find({ $and: filterArr })
            .skip(queries.skip)
            .limit(queries.limit)
            // .select(queries.fields)
            .sort(queries.sortBy)
            .populate({ path: "manufacturer", select: "name" })
            // .pupulate({ path: 'sellerId', select: 'slug' })

        const totalProducts = await Product.countDocuments({ $and: filterArr });
        // const totalProductsByFilter = await Product.countDocuments(filters);
        const totalPageNumber = Math.ceil(totalProducts / queries.limit);

        res.status(200).json({
            result: {
                totalProducts,
                totalPageNumber,
                data,
            },
            message: "Success",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: "There was a server side error!",
        });
    }
};

// ADMIN -> GET FLASH PRODUCTS BY FILTER
const getFlashProductsAdmin = async (req, res) => {
    try {
        // let filters = filtersFunction({ ...req?.query });

        const qFlashStatus = req.query.flashStatus;
        const qStatus = req.query.status;

        const qSort = req.query.sort;
        const qSearch = req.query.search;
        const qPrice = req.query.price;
        const qQuantity = req.query.quantity;
        const qModel = req.query.model;
        const qDate = req.query.date;
        // queries for products
        const queries = {};
        if (qSort) {
            if (qSort === "newest") {
                queries.sortBy = { createdAt: -1 };
            } else if (qSort === "price-asc") {
                queries.sortBy = { price: 1 };
            } else if (qSort === "price-desc") {
                queries.sortBy = { price: -1 };
            }
        }

        // fields mean which filed you want such as only name and price
        // if (req.query.fields) {
        //     const field = req.query.fields.split(",").join(" ");
        //     queries.fields = field;
        // }

        // page calculation
        const { page = 1, limit = 25 } = req.query || {};
        const skip = (page - 1) * parseInt(limit);
        queries.skip = skip;
        queries.limit = parseInt(limit);

        const filterArr = [];

        filterArr.push({ flashSale: true });
        if (qFlashStatus) filterArr.push({ flashSaleOfferType: qFlashStatus });

        if (qSearch) {
            filterArr.push({
                name: {
                    $regex: qSearch,
                    $options: "i",
                },
            });
        }
        if (qDate)
            filterArr.push({
                createdAt: {
                    $gte: new Date(qDate + "T00:00:00.000Z"),
                    $lte: new Date(qDate + "T12:59:59.000Z"),
                },
            });

        if (qPrice) {
            if (qPrice.includes("-")) {
                const splitPrice = qPrice.split("-");

                filterArr.push({
                    price: { $gte: splitPrice[0], $lte: splitPrice[1] },
                });
            } else {
                filterArr.push({
                    price: qPrice,
                });
            }
        }
        if (qQuantity) filterArr.push({ quantity: qQuantity });
        if (qStatus)
            filterArr.push({
                status: {
                    $regex: qStatus,
                    $options: "i",
                },
            });

        if (qModel)
            filterArr.push({
                model: {
                    $regex: qModel,
                    $options: "i",
                },
            });

        // final filter

        if (filterArr.length === 0) {
            const data = await Product.find({ flashSale: true });

            const totalProducts = await Product.countDocuments({
                flashSale: true,
            });
            // const totalProductsByFilter = await Product.countDocuments(filters);
            const totalPageNumber = Math.ceil(totalProducts / queries.limit);

            return res.status(200).json({
                result: {
                    totalProducts,
                    totalPageNumber,
                    data,
                },
                message: "Success",
            });
        }
        const data = await Product.find({ $and: filterArr })
            .skip(queries.skip)
            .limit(queries.limit)
            // .select(queries.fields)
            .sort(queries.sortBy)
            .populate({ path: "manufacturer", select: "name" });

        res.status(200).json({
            result: { data, timeStamps: 0 },
            message: "Success",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: "There was a server side error!",
        });
    }
};

// CLIENT -> GET SEARCH SUGGESTION
const getSearchSuggestion = async (req, res) => {
    try {
        const searchTerm = req.query.search; // Retrieve search term from query parameter
        if (!searchTerm) {
            return res.status(200).json({ tags: [] });
        }
        // Mongoose query to retrieve suggested search terms
        const suggestions = await Product.find(
            {
                $or: [
                    { name: { $regex: searchTerm, $options: "i" } },
                    // { description: { $regex: searchTerm, $options: "i" } },
                    {
                        tags: {
                            $elemMatch: { $regex: new RegExp(searchTerm, "i") },
                        },
                    },
                ],
            },
            { _id: 0, tags: 1 }
        )
            // .distinct("tags") // Retrieve distinct values of the 'tags' field
            .limit(10) // Limit the number of suggestions to 10
            .sort("tags"); // Sort the suggestions alphabetically

        let suggestedTerms = [];
        suggestions.forEach((product) => {
            suggestedTerms = suggestedTerms.concat(product.tags);
        });

        suggestedTerms = [...new Set(suggestedTerms)]; // Remove duplicates

        // Only return search results that match at least two characters
        const tags = suggestedTerms
            .filter((word) =>
                word.toLowerCase().startsWith(searchTerm.toLowerCase())
            )
            .slice(0, 10);

        res.status(200).json({ message: "Success", tags });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "There was a server error" });
    }
};

// GET SIX FLASH SALE PRODUCTS CLIENT
const getSixFlashProducts = async (req, res) => {
    try {
        const flashSaleData = await FlashOffer.findOne({ status: "active" });
        if (!flashSaleData?.offerType) {
            return res.status(200).json({
                result: { data: [], timeStamps: 0 },
            });
        }
        const data = await Product.find({
            flashSaleOfferType: { $in: flashSaleData.offerType },
            flashSale: true,
        })
            .skip(0)
            .limit(6);

        res.status(200).json({
            result: { data, timeStamps: flashSaleData?.timeStamps || 0 },
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: error.message || "There was a server side error!",
        });
    }
};
// GET ALL FLASH SALE PRODUCTS -> CLIENT
const getAllFlashProducts = async (req, res) => {
    try {
        const flashSaleData = await FlashOffer.findOne({ status: "active" });
        if (!flashSaleData?.offerType) {
            return res.status(200).json({
                result: { data: [], timeStamps: 0 },
            });
        }

        // pagination
        const queryPage = req.query.page || 1;
        const limitPerPage = req.query.limit || 25;
        let page = queryPage,
            limit = limitPerPage;
        const skip = (page - 1) * parseInt(limit);
        parseInt(limit);

        const data = await Product.find({
            flashSaleOfferType: { $in: flashSaleData.offerType },
            flashSale: true,
        })
            .skip(skip)
            .limit(limit);

        const totalProducts = await Product.countDocuments({
            flashSaleOfferType: { $in: flashSaleData.offerType },
            flashSale: true,
        });
        const totalPageNumber = Math.ceil(totalProducts / limit);

        res.status(200).json({
            result: {
                data,
                timeStamps: flashSaleData?.timeStamps || 0,
                totalProducts,
                totalPageNumber,
            },
        });
    } catch (error) {
        res.status(500).json({
            error: error.message || "There was a server side error!",
        });
    }
};
// GET ALL  PRODUCTS For HOME PAGE -> (Without FlashSale) -> CLIENT
const getAllProducts = async (req, res) => {
    try {
        const queryPage = req.query.page || 1;
        let page = queryPage,
            limit = 10;
        const skip = (page - 1) * parseInt(limit);
        parseInt(limit);

        const data = await Product.find({ flashSale: false })
            .skip(skip)
            .limit(limit);

        const totalProducts = await Product.countDocuments({ flashSale: false })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            data: {
                data,
                totalProducts,
            },
        });
        // res.status(200).json({
        //     data,
        // });
    } catch (error) {
        res.status(500).json({
            error: error.message || "There was a server side error!",
        });
    }
};

// GET ALL  BANNER PRODUCTS -> CLIENT
const getCampaignProducts = async (req, res) => {
    try {
        if (!req.params.campaignId) {
            return res
                .status(404)
                .json({ message: "Campaign slug is required" });
        }
        const bannerSlug = req.params.campaignId;

        let campaignData = null;
        campaignData = await desktopBanner.findOne({
            slug: bannerSlug,
        });
        if (!campaignData) {
            campaignData = await bottomBanner.findOne({
                slug: bannerSlug,
            });
        }
        if (!campaignData) {
            campaignData = await sideBanner.findOne({
                slug: bannerSlug,
            });
        }
        if (!campaignData) {
            campaignData = await relatedBanner.findOne({
                slug: bannerSlug,
            });
        }

        const categoryIds = campaignData?.categories?.map(
            (category) => category._id
        );
        const subCategoryIds = campaignData?.subCategories?.map(
            (subCategory) => subCategory._id
        );
        const subcategoryChildrenIds = campaignData?.subcategoryChildren?.map(
            (subcategoryChild) => subcategoryChild._id
        );

        const queryPage = req?.query?.page || 1;
        let page = queryPage,
            limit = 25;
        const skip = (page - 1) * parseInt(limit);
        parseInt(limit);

        const filterObject = {
            $or: [
                { "categories._id": { $in: categoryIds || [] } },
                { "subCategories._id": { $in: subCategoryIds || [] } },
                {
                    "subcategoryChildren._id": {
                        $in: subcategoryChildrenIds || [],
                    },
                },
            ],
            flashSale: false,
        };

        const relatedBannerData = await relatedBanner.findOne({
            relatedBannerName: campaignData?.name,
        });

        // find products
        let data = await Product.find(filterObject).skip(skip).limit(limit);

        const totalProducts = await Product.countDocuments(filterObject);
        const totalPageNumber = Math.ceil(totalProducts / limit);

        res.status(200).json({
            data,
            totalProducts,
            totalPageNumber,
            relatedBannerData,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: error.message || "There was a server side error!",
        });
    }
};

const getLowQuantityProducts = async (req, res) => {
    try {
        const data = await Product.find({
            quantity: { $lte: 5 },
        })
            .sort({ createdAt: -1 })
            .populate({ path: "manufacturer", select: "name" });

        res.status(200).json({
            message: "Success",
            data,
        });
    } catch (error) {
        res.status(500).json({ message: "There was a server side error" });
    }
};

// GET PRODUCTS BY PRODUCT TYPES
const getProductByProductType = async (req, res) => {
    try {
        const data = await Product.find({
            productType: req.params.productType,
            flashSale: false,
        }).populate({ path: "manufacturer", select: "name" });

        res.status(200).json({
            result: data,
            message: "Success",
        });
    } catch (error) {
        res.status(500).json({
            error: "There was a server side error!",
        });
    }
};

// GET RELATED PRODUCTS BY PRODUCT ID
const getRelatedProductsByProductId = async (req, res) => {
    try {
        const productName = req.params.name.split("-").join(" ");

        const dbProduct = await Product.findOne({ $or: [{ name: productName }, { slug: req.params.name }] });

        if (!dbProduct) {
            return res.status(200).json({ error: "Product not found" });
        }

        const categoryIds = dbProduct.categories.map(
            (category) => category._id
        );

        const data = await Product.find({
            "categories._id": { $in: categoryIds },
            _id: { $ne: dbProduct._id },
        });

        res.status(200).json({
            result: data,
            message: "Success",
        });
    } catch (err) {
        res.status(500).json({
            error: "There was a server-side error!",
        });
    }
};

// GET PRODUCTS BY BRAND ID
const getProductsByBrandId = async (req, res) => {
    try {
        const data = await Product.find({
            manufacturer: req.params.id,
        }).populate({ path: "manufacturer", select: "name" });

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


// GET PRODUCTS BY SELLER ID
const getProductsBySellerId = async (req, res) => {
    try {
        const data = await Product.find({
            sellerId: req.params.id,
        })
        // .populate({ path: "manufacturer", select: "name" });

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

// GET PRODUCTS BY PRODUCT CATEGORY
const getProductsByCategory = async (req, res) => {
    try {
        if (!req.params.category) {
            return res
                .status(400)
                .json({ message: "Category name is required" });
        }
        // const category = await Product.find({
        //     categories: req.params.category,
        //     flashSale: false,
        // });
        // const subcategory = await Product.find({
        //     subcategories: req.params.category,
        //     flashSale: false,
        // });
        // const subcategoryChild = await Product.find({
        //     subcategoryChildren: req.params.category,
        //     flashSale: false,
        // });
        let categoryData = null;
        categoryData = await Category.findOne({ title: req.params.category });
        if (!categoryData) {
            categoryData = await subCategory.findOne({
                title: req.params.category,
            });
        }
        if (!categoryData) {
            categoryData = await subcategoryChildren.findOne({
                title: req.params.category,
            });
        }
        const data = await Product.find({
            $or: [
                { categories: categoryData._id },
                { subcategories: categoryData._id },
                { subcategoryChildren: categoryData._id },
            ],
            $and: [{ flashSale: false }],
        });
        res.status(200).json({
            result: [...data],
            message: "Success",
        });
    } catch (err) {
        res.status(500).json({
            error: "There was a server side error!",
        });
    }
};

// GET SINGLE PRODUCT by ID -> CLIENT
const getProduct = async (req, res) => {
    try {
        const productName = req.params.name.split("-").join(" ");

        const data = await Product.findOne({
            $or: [{ name: productName }, { slug: req.params.name }],
        }).populate([
            { path: "manufacturer", select: "name" },
            { path: "color._id", select: "name colorCode" },
        ]);
        const category = data?.categories[0];
        const subcategory = data?.subcategories[0];
        const subcategoryChildren = data?.subcategoryChildren[0];

        const breadcrumb = await generateBreadcrumb(
            category,
            subcategory,
            subcategoryChildren
        );

        res.status(200).json({
            result: data,
            breadcrumb,
            message: "Success",
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: "There was a server side error!",
        });
    }
};

// GET SINGLE PRODUCT by ID -> CLIENT
const getProductAdmin = async (req, res) => {
    try {
        const data = await Product.findOne({ _id: req.params.id }).populate([
            {
                path: "reviews",
                populate: {
                    path: "user",
                },
            },
            {
                path: "manufacturer",
            },
        ]);
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

// CREATE SINGLE PRODUCT
const createProduct = async (req, res) => {
    try {
        // on the for loop call this uploader function and pass parameter a path to save on cloudinary server

        //  * @param {path} path
        //  * @returns a path url like: http://cludinary.images1.jpg

        const uploader = async (path) =>
            await cloudinary.uploads(path, "Products");

        const urls = [];
        const files = req.files;

        for (const file of files) {
            const { path } = file;

            // calll the uploader function and pass parameter a path
            const newPath = await uploader(path);
            urls.push(newPath.url);

            fs.unlinkSync(path);
        }
        if (urls) {
            const updateProductObject = {
                ...req.body,
            };

            if (req.body.offerPrice) {
                updateProductObject.offerPrice = req.body.offerPrice;
                const discount =
                    ((parseInt(req.body.price) -
                        parseInt(req.body.offerPrice)) /
                        parseInt(req.body.price)) *
                    100;
                updateProductObject.discountPercentage =
                    Math.round(discount) || 0;
            } else {
                updateProductObject.offerPrice = req.body.price;
            }

            updateProductObject.images = urls;
            if (req.body.tags)
                updateProductObject.tags = JSON.parse(req.body?.tags);
            if (req.body.color)
                updateProductObject.color = JSON.parse(req.body?.color);
            if (req.body.size)
                updateProductObject.size = JSON.parse(req.body?.size);

            if (req.body.categories)
                updateProductObject.categories = JSON.parse(
                    req.body?.categories
                );
            if (req.body.subcategories)
                updateProductObject.subcategories = JSON.parse(
                    req.body?.subcategories
                );
            if (req.body.subcategoryChildren)
                updateProductObject.subcategoryChildren = JSON.parse(
                    req.body?.subcategoryChildren
                );
            if (req.body.flashSaleOfferType)
                updateProductObject.flashSaleOfferType =
                    req.body.flashSaleOfferType;

            const newProduct = new Product(updateProductObject);

            await newProduct.save();

            res.status(200).json({
                message: "Product created successfully!",
            });
        } else {
            res.status(400).json({
                error: "Upload failed! Check all require fields",
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: "There was a server side error!",
        });
    }
};

// UPDATE SINGLE PRODUCT
const updateProduct = async (req, res) => {
    try {
        const uploader = async (path) =>
            await cloudinary.uploads(path, "Products");

        const urls = [];
        const files = req.files;

        for (const file of files) {
            const { path } = file;

            // call the uploader function and pass parameter a path
            const newPath = await uploader(path);
            urls.push(newPath.url);

            fs.unlinkSync(path);
        }

        const newImageUrls = [...urls];

        if (Array.isArray(req.body?.prevImage)) {
            req.body.prevImage.forEach((url) => newImageUrls.push(url));
        } else {
            newImageUrls.push(req.body.prevImage);
        }

        const updateProductObject = {
            ...req.body,
        };

        if (req.body.offerPrice) {
            updateProductObject.offerPrice = req.body.offerPrice;
            const discount =
                ((parseInt(req.body.price) - parseInt(req.body.offerPrice)) /
                    parseInt(req.body.price)) *
                100;
            updateProductObject.discountPercentage = Math.round(discount) || 0;
        } else if (req.body.price) {
            updateProductObject.offerPrice = req.body.price;
        }

        updateProductObject.images = newImageUrls;
        if (req.body.tags) updateProductObject.tags = JSON.parse(req.body.tags);
        if (req.body.color)
            updateProductObject.color = JSON.parse(req.body.color);

        if (req.body.size) updateProductObject.size = JSON.parse(req.body.size);
        if (req.body?.categories) {
            updateProductObject.categories = JSON.parse(req.body.categories);
        }
        if (req.body?.subcategories)
            updateProductObject.subcategories = JSON.parse(
                req.body.subcategories
            );
        if (req.body?.subcategoryChildren)
            updateProductObject.subcategoryChildren = JSON.parse(
                req.body.subcategoryChildren
            );

        if (req.body.description)
            updateProductObject.description = req.body.description;
        if (req.body.shortDescription)
            updateProductObject.shortDescription = req.body.shortDescription;
        if (req.body.specification)
            updateProductObject.specification = req.body.specification;

        await Product.findByIdAndUpdate(
            { _id: req.params.id },
            {
                $set: updateProductObject,
            },
            {
                new: true,
                useFindAndModify: false,
            }
        );

        // if product is updated successfully than update user cart offerPrice for this product
        const dbProduct = await Product.findOne({ _id: req.params.id });

        await Cart.updateMany(
            { "products.product": req.params.id },
            {
                $set: {
                    "products$.offerPrice": dbProduct.offerPrice,
                },
            },
            {
                useFindAndModify: false,
                new: true,
            }
        );

        res.status(200).json({
            message: "Product update successfully!",
        });
    } catch (error) {
        console.log("error", error);
        res.status(500).json({
            message: "There was a server side error!",
        });
    }
};

// DELETE SINGLE PRODUCT
const deleteProduct = async (req, res) => {
    await Product.deleteOne({ _id: req.params.id }, (err) => {
        if (err) {
            res.status(500).json({
                error: "There was a server side error!",
            });
        } else {
            res.status(200).json({
                message: "Product has been deleted successfully!",
            });
        }
    }).clone();
};

// DELETE ALL PRODUCTS
const deleteProducts = async (req, res) => {
    try {
        await Product.deleteMany({});

        res.status(200).json({
            message: "All Products has been deleted successfully!",
        });
    } catch (error) {
        res.status(500).json({
            error: "There was a server side error!",
        });
    }
};

async function generateBreadcrumb(category, subCate, subCategoryChild) {
    const breadcrumb = [];

    if (category) {
        const cTitle = await Category.findOne({
            _id: category._id,
        }).select("title slug");
        cTitle &&
            breadcrumb.push({ title: cTitle.title, slug: cTitle.slug });
    }
    if (subCate) {
        const cTitle = await subCategory
            .findOne({
                _id: subCate._id,
            })
            .select("title slug");
        cTitle &&
            breadcrumb.push({ title: cTitle.title, slug: cTitle.slug });
    }
    if (subCategoryChild) {
        const cTitle = await subcategoryChildren
            .findOne({
                _id: subCategoryChild._id,
            })
            .select("title slug");
        cTitle &&
            breadcrumb.push({ title: cTitle.title, slug: cTitle.slug });
    }
    return breadcrumb;
}

//schedule function for off the offer
cron.schedule("*/10 * * * * *", async () => {
    const products = await Product.find({ quantity: 0 });
    products?.forEach(async (offer) => {
        const id = offer._id;

        await Product.findOneAndUpdate(
            { _id: id },
            {
                $set: { status: "OUT-OF-STOCK" },
            },
            {
                new: true,
                useFindAndModify: false,
            }
        );
    });
});

module.exports = {
    getProducts,
    getFlashProductsAdmin,
    getLowQuantityProducts,
    getSearchSuggestion,
    getProduct,
    getProductAdmin,
    getProductByProductType,
    getProductsByCategory,
    createProduct,
    updateProduct,
    deleteProducts,
    deleteProduct,

    getRelatedProductsByProductId,
    getProductsByBrandId,
    getAllProducts,
    getCampaignProducts,
    getSixFlashProducts,
    getAllFlashProducts,
    getProductsBySellerId
};
