const mongoose = require("mongoose");

const layoutSchema = mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
        },
        name: {
            type: String,
        },
        selected: {
            type: Number,
            required: true
        }
    },
    {
        timestamps: true,
    }
);

const Layout = mongoose.model('layout', layoutSchema)


module.exports = Layout
