const { default: mongoose } = require("mongoose");
require("dotenv").config();
mongoose.set("strictQuery", false);
module.exports = databaseConnect = async () => {
    try {
        const response = await mongoose.connect(
            `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@backend.ounawju.mongodb.net/`
            // `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.9gvzlfg.mongodb.net/?retryWrites=true&w=majority`
        );

        console.log("Database is connected successfully!");
    } catch (error) {
        console.log("MongoDb_error_______", error);
    }
};
