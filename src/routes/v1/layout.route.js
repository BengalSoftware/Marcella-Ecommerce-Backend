const express = require("express");
const Layout = require("../../models/layout.model");
const router = express.Router();
// DONE - All layout - Admin + Client
router.get("/:email", async (req, res) => {
    try {
        let totalLayouts;
        totalLayouts = await Layout.find({ email: req.params.email }).countDocuments();
        const layout = await Layout.find({ email: req.params.email });

        if (layout) {
            res.status(200).json({
                message: "success",
                totalLayouts,
                data: layout
            })
        } else {
            res.status(404).json({ message: "layout not found" })
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
});



router.put("/:email", async (req, res) => {
    try {
        let layout = await Layout.findOne({ email: req.params.email });

        if (!layout) {
            layout = new Layout({
                email: req.params.email,
            });
        }

        layout.set(req.body);
        const result = await layout.save();

        res.status(200).json({
            message: "Success",
            data: result
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;
