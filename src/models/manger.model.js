const mongoose = require("mongoose");

const ManagerSchema = mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
        },
        password: {
            typeof: String,
            required: true,
        },
        role: {
            manager,
        },
    },
    {
        timestamps: true,
    }
);
mongoose.models = {};
module.exports = mongoose.model("manager", ManagerSchema);
