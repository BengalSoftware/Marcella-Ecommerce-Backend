const express = require("express");
const { authentication } = require("../../config/Authenticate");
const User = require("../../models/user.model");
const CustomerGroup = require("../../models/userGroup.model");
const router = express.Router();

// CREATE CUSTOMER GROUP - ADMIN
router.post("/add", authentication, async (req, res) => {
    try {
        const isExist = await CustomerGroup.findOne({
            groupName: req.body.groupName,
        });

        if (isExist) {
            return res
                .status(400)
                .send({ message: "Group name already exists" });
        }
        const newGroup = new CustomerGroup(req.body);
        await newGroup.save();
        res.status(200).send({ message: "new group added!!" });
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: "new group server error!!" });
    }
});

// GET ALL CUSTOMER GROUP - ADMIN
router.get("/", authentication, async (req, res) => {
    try {
        const data = await CustomerGroup.find({});
        res.status(200).send(data);
    } catch (err) {
        res.status(500).send({ message: "server error!!" });
    }
});

// GET CUSTOMER GROUP by GROUP NAME - ADMIN
router.get("/groupName/:name", authentication, async (req, res) => {
    try {
        const group = await CustomerGroup.find({ groupName: req.params.name });

        const data = await User.find({ groupName: req.params.name });
        res.status(200).send({ group, data });
    } catch (err) {
        res.status(500).send({ message: "server error!!" });
    }
});

// GET SINGLE CUSTOMER GROUP by ID - ADMIN
router.get("/:id", authentication, async (req, res) => {
    try {
        const data = await CustomerGroup.findOne({ _id: req.params.id });
        res.status(200).send(data);
    } catch (err) {
        res.status(500).send({ message: "server error!!" });
    }
});

// UPDATE CUSTOMER GROUP INFORMATION by ID - ADMIN
router.put("/groupInformationUpdate/:id", authentication, async (req, res) => {
    try {
        const updateObject = {};

        const { discount, discountType, groupName, totalAmount, description } =
            req.body || {};

        if (discount) updateObject.discount = discount;
        if (discountType) updateObject.discountType = discountType;
        if (groupName) updateObject.groupName = groupName;
        if (totalAmount) updateObject.totalAmount = totalAmount;
        if (description) updateObject.description = description;

        const isExist = await CustomerGroup.findOne({
            groupName: groupName,
            _id: { $ne: req.params.id },
        });

        if (isExist) {
            return res
                .status(400)
                .send({ message: "Group name already exists" });
        }

        await CustomerGroup.updateOne(
            { _id: req.params.id },
            {
                $set: updateObject,
            },
            {
                useFindAndModify: false,
                new: true,
            }
        );
        res.status(200).send({ message: "group information updated!" });
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: "group information server error!!" });
    }
});

// DELETE CUSTOMER GROUP by ID - ADMIN
router.delete("/groupDelete/:id", authentication, async (req, res) => {
    try {
        await CustomerGroup.deleteOne({ _id: req.params.id });
        res.status(200).send({ message: "group deleted successful!!" });
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: "group deleted server error!!" });
    }
});

// Assigning user to a specific group api - ADMIN
router.put("/assigningToGroup", authentication, async (req, res) => {
    try {
        await User.updateOne(
            { email: req.body.email },
            {
                $set: {
                    groupName: req.body.groupName,
                },
            }
        );
        res.status(200).send({ message: "user group assigned !" });
    } catch (err) {
        console.log(err);
        res.status(500).send({
            message: "user group assigned server side error!",
        });
    }
});

module.exports = router;
