const cloudinary = require("cloudinary");
const dotenv = require("dotenv");

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.uploads = (file, folder) => {
    return new Promise((resolve) => {
        cloudinary.uploader.upload(
            file,
            (result) => {
                resolve({
                    url: result.url,
                    id: result.public_id,
                });
            },
            {
                resource_type: "auto",
                folder: folder,
            }
        );
    });
};

exports.destroy = (file) => {
    return new Promise((resolve) => {
        cloudinary.uploader.destroy(file, (result, error) => {
            if (error) {
                console.error(error);
                resolve(false);
            } else {
                resolve(true);
                console.log(`Image deleted: ${file} & result: ${result}`);
            }
        });
    });
}
