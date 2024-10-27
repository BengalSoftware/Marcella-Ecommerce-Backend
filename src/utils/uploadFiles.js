const multer = require("multer");

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "./uploaded_file/");
    },
    filename: (req, file, callback) => {
        callback(null, Date.now() + "-" + file.originalname);
    },
});

const fileFilter = (req, file, callback) => {
    if (
        file.fieldname === "photoUrl" ||
        file.fieldname === "images" ||
        file.fieldname === "heroImage" ||
        file.fieldname === "image"
    ) {
        if (
            file.mimetype === "image/jpeg" ||
            file.mimetype === "image/jpg" ||
            file.mimetype === "image/gif" ||
            file.mimetype === "image/png" ||
            file.mimetype === "image/webp"
        ) {
            callback(null, true);
        } else {
            callback(
                new Error("Only jpg, jpeg, png, gif, file format allowed!")
            );
        }
    } else {
        callback(new Error("There was an unknown error!"));
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 2, // maximum file size 2MB
    },
    fileFilter: fileFilter,
});

module.exports = upload;
