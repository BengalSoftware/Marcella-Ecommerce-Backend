const User = require("../models/user.model");
const { generateToken } = require("../utils/token");
const { transport } = require("../config/mailTransport");
const bcrypt = require("bcryptjs");
const ejs = require("ejs");
const Seller = require("../models/seller.model");
const { default: mongoose } = require("mongoose");
const cloudinary = require("../config/cloudinary");

const fs = require("fs");

// NEW USER REGISTER CONTROLLER -> USER
module.exports.register = async (req, res) => {
    try {
        const isExistEmail = await User.findOne({ email: req.body.email }) || await Seller.findOne({ email: req.body.email });
        if (isExistEmail) {
            return res.status(400).json({
                message: "Email already exists",
            });
        }

        const user = await new User(req.body);

        // password hashing
        const password = user.password;
        const hasPassword = bcrypt.hashSync(password);
        user.password = hasPassword;

        // call the function from User model instance and get a token for generate a verification email link
        const token = user.generateConfirmationToken();

        // generate an access token
        const generateAccessToken = generateToken(user);

        // validateBeforeSave for not validate now on user model
        await user.save({ validateBeforeSave: false });

        const link = `${req.protocol}://${req.get("host")}${req.originalUrl
            }/confirmation/${token}`;

        // ejs use for make email templates
        ejs.renderFile(
            __dirname + "/../views/verificationEmail.ejs",
            {
                name: user.name,
                activeLink: link,
                buttonTitle: "Active account",
                message:
                    " Thank you for signup. Please verify your email address to click this button.",
            },
            async function (err, data) {
                if (err) {
                    return res.status(400).json({
                        message: "failure",
                    });
                } else {
                    let mailOptions = {
                        from: process.env.EMAIL_FROM,
                        to: [user.email],
                        subject: "Verify your account",
                        text: `Congress!`,
                        html: data,
                    };
                    // send mail on transporter
                    await transport.sendMail(mailOptions);
                }
            }
        );

        // userInfo to send user info
        const userInfo = {
            user: {
                email: user.email,
                groupName: user.groupName,
                verified: user.verified,
            },
            token: generateAccessToken,
        };
        res.status(200).json({
            status: "Success",
            message: "Successfully signed up",
            data: userInfo,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "failure",
            error,
        });
    }
};



//SELLER REGISTER CONTROLLER -> SELLER
module.exports.sellerRegister = async (req, res) => {
    try {
        const { name, email } = req.body;
        const isExistEmail = await Seller.findOne({ email: email }) || await User.findOne({ email: email });
        if (isExistEmail) {
            return res.status(400).json({
                message: "Email already exists",
            });
        }
        const user = await Seller(req.body);

        // password hashing
        const password = user.password;
        const hasPassword = bcrypt.hashSync(password);
        user.password = hasPassword;


        //unique slug
        const slug = user.name
        let lowercaseString = slug.toLowerCase();
        let nameArray = lowercaseString.split(" ");
        let concatenatedString = nameArray.join("-");
        let randomNumber = Math.floor(Math.random() * 90 + 10);
        let finalString = concatenatedString + "-" + randomNumber;
        user.slug = finalString;

        const token = generateToken(user);

        const seller = new Seller(user)
        const result = await seller.save();
        res.status(200).json({
            message: 'Success Seller',
            data: {
                user: {
                    name: result?.name,
                    email: result?.email,
                    status: result?.status,
                    role: result?.role
                },
                token,
            }
        })

    } catch (error) {
        res.status(500).json({
            message: "failure",
            error,
        });
    }
}


// seller get controller 

module.exports.seller = async (req, res) => {
    try {
        const seller = await Seller.find();
        const totalSeller = await Seller.countDocuments();
        if (seller) {
            res.status(200).json({
                message: 'Success',
                totalSeller,
                data: seller
            })
        } else {
            res.status(404).json({
                message: 'Server Side error'
            })
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}


// get single seller 
module.exports.singleSeller = async (req, res) => {
    try {
        const email = req.params.email;
        const seller = await Seller.findOne({ email: email });
        const totalSeller = await Seller.findOne({ email: email }).countDocuments();
        if (seller) {
            res.status(200).json({
                message: 'Success',
                totalSeller,
                data: seller
            })
        } else {
            res.status(404).json({
                message: 'Server Side error'
            })
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}



// get single seller 
module.exports.singleSellerClient = async (req, res) => {
    try {
        const id = req.params.id;
        let seller;
        if (mongoose.Types.ObjectId.isValid(id)) {
            seller = await Seller.findById(id);
        } else {
            seller = await Seller.findOne({ slug: id });
        }

        if (seller) {
            res.status(200).json({
                message: 'Success',
                data: seller
            });
        } else {
            res.status(404).json({
                message: 'Seller not found'
            });
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}


//UPDATE SINGLE SELLER  
module.exports.updateSeller = async (req, res) => {
    try {
        const id = req.params.id;
        // const updatedData = req.body;



        const path = req?.file?.path;
        const uploader = async (pathUrl) =>
            await cloudinary.uploads(pathUrl, "profileUrl");

        // call the cloudinary function and get an array of url
        let newUrl = "";
        if (path) {
            newUrl = await uploader(path);
            fs.unlinkSync(path);
        }
        const updateObject = {};
        if (req.body.name) updateObject.name = req.body.name;
        if (req.body.phone) updateObject.phone = req.body.phone;
        if (req.body.email) updateObject.email = req.body.email;
        if (req.body.metaTitle) updateObject.metaTitle = req.body.metaTitle;
        if (req.body.metaDescription) updateObject.metaDescription = req.body.metaDescription;
        if (newUrl.url) updateObject.profileUrl = newUrl.url;
        
        const seller = await Seller.findByIdAndUpdate(id, updateObject, { new: true });
        if (seller) {
            res.status(200).json({
                message: 'Seller updated successfully',
                data: seller
            });
        } else {
            res.status(404).json({
                message: 'Seller not found'
            });
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};





// USER LOGIN CONTROLLER -> USER
module.exports.login = async (req, res, next) => {
    try {
        const userEmail = req.body?.email;
        const password = req.body?.password;

        // step 1: if email or password do not enter
        if (!password || !userEmail) {
            return res.status(401).json({
                status: "fail",
                message: "Please provide your credentials",
            });
        }

        // step 2: load user by email
        let user = null;

        if (userEmail) {
            user = await User.findOne(
                {
                    $or: [{ email: userEmail }, { phone: userEmail }],
                },
                null,
                { maxTimeMS: 30000 }
            ) || await Seller.findOne(
                {
                    $or: [{ email: userEmail }, { phone: userEmail }],
                },
                null,
                { maxTimeMS: 30000 }
            )
        }

        // step 3: if user not exist then return error
        if (!user?.email) {
            return res.status(401).json({
                status: "fail",
                message: "No user with that email",
            });
        }

        // step 4: if user password is not correct then return
        // const isPasswordValid = user.comparePassword(password, user.password);
        const isPasswordValid = bcrypt.compareSync(password, user.password);

        // step 5: if password is not correct then return
        if (!isPasswordValid) {
            return res.status(403).json({
                status: "failure",
                message: "Password is not correct",
            });
        }

        // step 6: if user is not active (status)
        // if (user.status != "active") {
        //   return res.status(401).json({
        //     status: "failure",
        //     message: "Your account is not active",
        //   });
        // }
        // console.log(user)
        const token = generateToken(user);
        const { verified, groupName, email, role, status } = user.toObject();

        res.status(200).json({
            message: "Successfully sign in",
            data: {
                user: { email, verified, groupName, role, status },
                token,
            },
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error,
        });
    }
};

// EMAIL CONFIRMATION AND UPDATE USER VERIFIED STATUS -> USER
module.exports.confirmation = async (req, res, next) => {
    try {
        const { token } = req.params || {};
        const user = await User.findOne({ confirmationToken: token });

        // if user not exists then return error
        if (!user) {
            return res.redirect(`${process.env.CLIENT_URL}/verify`);
        }

        // if token date is expired
        const expired =
            new Date().getTime() > new Date(user.expiredTokenDate).getTime;
        if (expired) {
            return res.redirect(`${process.env.CLIENT_URL}/verify`);
        }

        user.confirmationToken = undefined;
        user.expiredTokenDate = undefined;
        user.verified = true;

        await user.save({ validateBeforeSave: false });

        res.redirect(process.env.CLIENT_URL);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: "There was an server error",
        });
    }
};

// GOOGLE LOGIN USER INFO SAVE ON DB
module.exports.oAuthLoginDataSaveUserModel = async (data) => {
    try {
        const isExist = await User.findOne({ email: data.email });
        if (!isExist) {
            const saveData = await new User(data);
            await saveData.save();
            return;
        }
        return;
    } catch (error) {
        res.status(500).json({
            error: "failure",
        });
    }
};

// EMAIL VERIFICATION MAIL SEND
module.exports.resendVerificationEmail = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        const token = user.generateConfirmationToken();
        // user model save token expire date for verification email
        let registrationTime = new Date();
        let expirationTime = new Date(
            registrationTime.getTime() + 24 * 60 * 60 * 1000
        );

        await User.updateOne(
            {
                _id: user._id,
            },
            {
                confirmationToken: token,
                expiredTokenDate: expirationTime,
            }
        );

        // update user with this token and

        const link = `${req.protocol}://${req.get(
            "host"
        )}/v1/auth/confirmation/${token}`;

        // ejs use for make email templates
        ejs.renderFile(
            __dirname + "/../views/verificationEmail.ejs",
            {
                name: user.name,
                activeLink: link,
                buttonTitle: "Active account",
                message:
                    " Thank you for signup. Please verify your email address to click this button.",
            },
            async function (err, data) {
                if (err) {
                    return res.status(400).json({
                        message: "failure",
                    });
                } else {
                    let mailOptions = {
                        from: process.env.EMAIL_FROM,
                        to: [user.email],
                        subject: "Verify your account",
                        text: `Congress!`,
                        html: data,
                    };
                    // send mail on transporter
                    await transport.sendMail(mailOptions);
                }
            }
        );

        res.status(200).json({ message: "Successfully send email" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "There was an server error", error });
    }
};

// TODO: RESET PASSWORD -> CLIENT
module.exports.sendForgetPasswordEmail = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        // generate an access token
        const nowDate = new Date().getTime();
        const token = `bd_beponi_reset_password${nowDate}`;
        // user model save token expire date for verification email

        // user model save token expire date for verification email
        let registrationTime = new Date();
        let expirationTime = new Date(
            registrationTime.getTime() + 24 * 60 * 60 * 1000
        );

        await User.updateOne(
            {
                _id: user._id,
            },
            {
                passwordResetToken: token,
                passwordResetExpires: expirationTime,
            }
        );

        // update user with this token and

        const link = `${process.env.CLIENT_URL}/reset-password/${token}`;

        // ejs use for make email templates
        ejs.renderFile(
            __dirname + "/../views/verificationEmail.ejs",
            {
                name: user.name,
                activeLink: link,
                buttonTitle: "Reset password",
                message:
                    "Welcome to bd beponi. To reset your password, click the button below to reset your password",
            },
            async function (err, data) {
                if (err) {
                    return res.status(400).json({
                        message: "failure",
                    });
                } else {
                    let mailOptions = {
                        from: process.env.EMAIL_FROM,
                        to: [user.email],
                        subject: "Reset Your Password",
                        text: `Click the button below to reset your password`,
                        html: data,
                    };
                    // send mail on transporter
                    await transport.sendMail(mailOptions);
                }
            }
        );

        res.status(200).json({ message: "Successfully send email" });
    } catch (error) {
        res.status(500).json({ message: "There was an server error", error });
    }
};

module.exports.resetPassword = async (req, res) => {
    try {
        const { token, password, confirmPassword } = req.body || {};
        if (password !== confirmPassword) {
            return res
                .status(401)
                .json({ message: "Confirm password not match" });
        }
        if (!token) {
            return res.status(401).json({ message: "Token is required" });
        }
        // find user by token
        const user = await User.findOne({ passwordResetToken: token });
        if (!user) {
            return res
                .status(401)
                .json({ message: "User not found to this token" });
        }

        // if token date is expired
        const expired = new Date() > new Date(user.passwordResetExpires);
        if (expired) {
            return res.status(401).json({
                status: "failure",
                error: "Token is expired",
            });
        }
        const hasPassword = bcrypt.hashSync(password);

        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        user.password = hasPassword;

        await user.save({ validateBeforeSave: false });

        res.status(200).json({
            status: "Successfully update password",
        });
    } catch (error) {
        res.status(500).json({
            message: "There was an server error",
        });
    }
};
