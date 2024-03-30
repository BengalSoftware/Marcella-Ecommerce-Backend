const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

// define the storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploaded_file");
    },
    filename: (req, file, cb) => {
        // Important file.pdf --> important-file-234241.pdf
        const fileExtension = path.extname(file.originalname);

        const fileName =
            file.originalname
                .replace(fileExtension, "")
                .toLowerCase()
                .split(" ")
                .join("-") + Date.now();

        cb(null, fileName + fileExtension);
    },
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 50,
    }, // 50 MB=5*1000000 Byte
    fileFilter: (req, file, cb) => {
        console.log(file);
        if (
            file.fieldname === "gallery" ||
            file.fieldname === "avater_1" ||
            file.fieldname === "avater_2"
        ) {
            if (
                file.mimetype === "image/jpeg" ||
                file.mimetype === "image/jpg" ||
                file.mimetype === "image/png"
            ) {
                cb(null, true);
            } else {
                cb(new Error("only jpg,png,jpeg file allowed !!"));
            }
        } else if (file.fieldname === "doc") {
            if (file.mimetype === "application/pdf") {
                cb(null, true);
            } else {
                cb(new Error("only pdf file allowed !!"));
            }
        } else {
            cb(new Error("There was an unknown error !!"));
        }
    },
});

router.post("/single", upload.single("avater_1"), (req, res) => {
    res.send("file uploded !");
});

router.post("/multiple", upload.array("avater_2", 3), (req, res) => {
    res.json({
        data: req.files,
        message: "All files uploaded successfully!",
    });
});

router.post(
    "/differentField",
    upload.fields([
        { name: "gallery", maxCount: 2 },
        { name: "doc", maxCount: 5 },
    ]),
    (req, res) => {
        // console.log(req.files);
        res.send("files uploaded!");
    }
);

module.exports = router;
