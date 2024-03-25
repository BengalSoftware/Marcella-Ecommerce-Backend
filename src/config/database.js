const { default: mongoose } = require("mongoose");
require("dotenv").config();
mongoose.set("strictQuery", false);
module.exports = databaseConnect = async () => {
    try {
        const response = await mongoose.connect(
            `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.25e8eyk.mongodb.net/`
        );

        console.log("Database is connected successfully!");
    } catch (error) {
        console.log("MongoDb_error_______", error);
    }
};
