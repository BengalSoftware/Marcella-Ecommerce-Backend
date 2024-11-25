const express = require("express");
const cors = require("cors");
const passport = require("passport");
const routes = require("./src/routes/v1");
const helmet = require("helmet");
const databaseConnect = require("./src/config/database");
var cookieSession = require("cookie-session");
const bodyParser = require("body-parser");
const multer = require("multer");
const compression = require('compression');
const path = require("path");
const morgan = require("morgan");
const session = require("express-session");
// import it for google login
require("./src/config/authenticationPassport");
require("./src/config/passport")(passport);

require("dotenv").config();

// express app initialization
const app = express();

// MIDDLEWARE
app.use(compression());
app.use(morgan("common"));

app.use(function (req, res, next) {
    var allowedOrigins = ['https://veendeshi.com', 'https://www.veendeshi.com', 'https://admin.veendeshi.com', 'http://localhost:3001', 'http://localhost:3000'];
    var origin = req.headers.origin;
    //  if (allowedOrigins.indexOf(origin) > -1) {
    //     res.setHeader('Access-Control-Allow-Origin', origin);
    //}
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Credentials", true);
    next();

});

app.use(cors({
    origin: ['https://veendeshi.com', 'https://www.veendeshi.com', 'https://admin.veendeshi.com', 'http://localhost:3001', 'http://localhost:3000'],
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    credentials: true
}));




// set security HTTP headers
app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // parse json request body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("trust proxy", 1); // trust first proxy

app.use(
    cookieSession({
        name: "session",
        keys: ["bdbeponi"],
        // maxAge: 24 * 60 * 60 * 100,
    })
);

app.use(session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: true
}))

// passport initialization and session
app.use(passport.initialize());
app.use(passport.session());

app.use("/static", express.static(path.join(__dirname, "/uploaded_file")));

// connect to database
databaseConnect();

// home route
app.get("/", (req, res) => {
    res.send("Server is running...");
});

// v1 api routes
app.use("/v1", routes);

// default error handler
const errorHandler = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }
    res.status(500).json({ error: err });
};

app.use(errorHandler);

// default error handler

app.use((err, req, res, next) => {
    if (err) {
        if (err instanceof multer.MulterError) {
            res.status(500).send("File upload error!", err);
        } else {
            res.status(500).send(err.message);
        }
    }
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`App is listening to port ${port}`);
});

