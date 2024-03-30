const ProductType = require("../models/productType.model");

// DONE - GET ALL product type
const AddProductType = async (req, res) => {
    try {
        const productType = await ProductType(req.body);
        const result = await productType.save();
        res.status(200).json({
            result,
            message: "Success",
        });
    } catch (err) {
        res.status(500).json({
            error: "There was a server side error!",
        });
    }
};

// DONE - GET ALL product type
const getAllProductType = async (req, res) => {
    try {
        const productType = await ProductType.find()
            .sort({ sortOrder: 1 });
        res.status(200).json({
            result: productType,
            message: "Success",
        });
    } catch (err) {
        res.status(500).json({
            error: "There was a server side error!",
        });
    }
};



// get single product type
const getSingleProductType = async (req, res) => {
    try {
        const productType = await ProductType.findOne({ _id: req.params.id });

        if (!productType) {
            return res.status(404).json({
                error: "Product type not found",
            });
        }

        res.status(200).json({
            result: productType,
            message: "Success",
        });
    } catch (err) {
        console.error("Error fetching product type:", err);
        res.status(500).json({
            error: "There was a server side error!",
        });
    }
};



// DONE - GET ALL product type
const updateProductType = async (req, res) => {
    try {
        const productType = await ProductType.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!productType) {
            return res.status(404).json({
                error: "Product type not found",
            });
        }

        res.status(200).json({
            result: productType,
            message: "Product type updated successfully",
        });
    } catch (err) {
        console.error("Error updating product type:", err);
        res.status(500).json({
            error: "There was a server side error!",
        });
    }
};


//delete
const deleteProductType = async (req, res) => {
    try {
        const productType = await ProductType.findByIdAndDelete(req.params.id);

        if (!productType) {
            return res.status(404).json({
                error: "Product type not found",
            });
        }

        res.status(200).json({
            message: "Product type deleted successfully",
        });
    } catch (err) {
        console.error("Error deleting product type:", err);
        res.status(500).json({
            error: "There was a server side error!",
        });
    }
};






module.exports = {
    AddProductType,
    getAllProductType,
    getSingleProductType,
    updateProductType,
    deleteProductType
};
