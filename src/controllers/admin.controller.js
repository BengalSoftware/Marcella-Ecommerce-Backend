const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { adminRegisterValidate } = require("../validator/registerValidator");
const loginValidator = require("../validator/loginValidator");
const { serverError, resourceError } = require("../utils/error");
const Admin = require("../models/admin.model");
const bcryptJs = require("bcryptjs");

// login controller
module.exports.login = async (req, res) => {
    // request from admin dashboard

    let { email, password } = req.body;
    let validate = loginValidator({ email, password });

    if (!validate.isValid) {
        return res.status(400).json(validate.error);
    }
    await Admin.findOne({ email }, null, { maxTimeMS: 20000 })
        // Use Populate for transaction
        .then((u) => {
            if (!u) {
                return resourceError(res, "User Not Found");
            }
            bcrypt.compare(password, u.password, async (err, result) => {
                if (err) {
                    console.log("error");

                    return serverError(res, err);
                }
                if (!result) {
                    return resourceError(res, "Password Doesn't Match");
                }

                // generate JWT Token
                let token = jwt.sign(
                    {
                        _id: u._id,
                        email: u.email,
                    },
                    process.env.JWT_SECRET,
                    { expiresIn: "2h" }
                );

                res.status(200).json({
                    email: u.email,
                    message: "Login Successful",
                    token: `Bearer ${token}`,
                    role: u.role,
                });
            });
        })
        .catch((error) => {
            serverError(res, error);
        });
};

// Registration controller
module.exports.register = async (req, res) => {
    let { name, email, password, confirmPassword, uid } = req.body;
    let validate = adminRegisterValidate({
        name,
        email,
        password,
        confirmPassword,
        uid,
    });

    if (!validate.isValid) {
        return res.status(400).json(validate.error);
    } else {
        await Admin.findOne({ email })
            .then((u) => {
                console.log(u);
                if (u) {
                    return resourceError(res, "User already exists!");
                }

                bcrypt.hash(password, 11, (err, hash) => {
                    if (err) {
                        return resourceError(res, "Server Error Occurred");
                    }

                    const newuser = new Admin({
                        name,
                        email,
                        password: hash,
                    });

                    newuser
                        .save()
                        .then((u) => {
                            res.status(201).json({
                                message: "Admin Created Successfully",
                                //u,
                            });
                        })
                        .catch((error) => serverError(res, error));
                });
            })
            .catch((error) => serverError(res, error));
    }
};

// ALL ADMIN GET -> ADMIN
module.exports.allAdmin = async (req, res) => {
    try {
        const data = await Admin.find({ role: "superAdmin" });
        res.status(200).send(data);
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: "server side error" });
    }
};

// ADMIN PASSWORD CHANGE & UPDATE -> ADMIN
module.exports.updateAdminPassword = async (req, res, next) => {
    try {
        console.log(req.params.email);
        const user = await Admin.findOne({ email: req.params.email });
        if (!user) {
            return res.status(401).json({
                message: "Account Not Found",
            });
        }

        const { oldPassword, password, name, currentUserEmail } =
            req.body || {};

        const requestUser = await Admin.findOne({ email: currentUserEmail });

        if (requestUser.role != "superAdmin" || !requestUser) {
            return res.status(401).json({
                message: "You are unauthorized",
            });
        }

        // console.log("oldPassword", user.password)

        const isPasswordValid = bcryptJs.compareSync(
            oldPassword,
            user.password
        );

        // step 5: if password is not correct then return
        if (!isPasswordValid) {
            return res.status(403).json({
                message: "Old password is not correct",
            });
        }

        // password is mean newPassword
        const hasPassword = bcryptJs.hashSync(password);
        if (password) user.password = hasPassword;
        if (name) user.name = name;

        user.save();

        res.status(200).json({
            message: "Updated Successfully",
        });
    } catch (err) {
        console.log(err);
        res.status(400).json({
            message: "There was a server side error!",
        });
    }
};

// GET ADMIN BY EMAIL -> ADMIN
module.exports.getAdminInfoByEmail = async (req, res) => {
    try {
        const data = await Admin.findOne({ _id: req.params.id });
        const { email, name, _id, role } = data;
        res.status(200).send({ email, name, _id, role });
    } catch (err) {
        res.status(500).json({
            message: "server side error",
        });
    }
};

// ADMIN PASSWORD CHANGE & UPDATE -> ADMIN
module.exports.updateAndPasswordChange = async (req, res, next) => {
    try {
        const user = await Admin.findOne({ _id: req.params.id });
        if (!user) {
            return res.status(404).json({
                message: "Account Not Found",
            });
        }

        const { oldPassword, password, name, role, currentUserEmail } =
            req.body || {};

        const requestUser = await Admin.findOne({ email: currentUserEmail });

        if (role === "superAdmin" && requestUser.role != "superAdmin") {
            return res.status(401).json({
                message: "You are not permit",
            });
        }

        if (requestUser.role === "manager") {
            return res.status(401).json({
                message: "You are not permit",
            });
        }
        // console.log("oldPassword", user.password)
        let hasPassword = null;
        if (password) {
            const isPasswordValid = bcryptJs.compareSync(
                oldPassword,
                user.password
            );

            // step 5: if password is not correct then return
            if (!isPasswordValid) {
                return res.status(403).json({
                    message: "Old password is not correct",
                });
            }

            // password is mean newPassword
            hasPassword = bcryptJs.hashSync(password);
        }
        if (password) user.password = hasPassword;
        if (name) user.name = name;
        if (role) user.role = role;

        user.save();

        res.status(200).json({
            message: "Updated Successfully",
        });
    } catch (err) {
        console.log(err);
        res.status(400).json({
            message: "There was a server side error!",
        });
    }
};

module.exports.deleteAdmin = async (req, res, next) => {
    try {
        const id = req.params.id;

        const { currentUserEmail } = req.body || {};

        if (!id) {
            return res.status(404).json({ message: "Id is invalid" });
        }

        const dbAdmin = await Admin.findOne({ _id: id });

        const requestUser = await Admin.findOne({ email: currentUserEmail });

        if (!dbAdmin || !requestUser) {
            return res.status(400).json({ message: "This user not found" });
        }

        if (dbAdmin?.role === "superAdmin") {
            return res.status(401).json({ message: "Your are un authorized" });
        }

        if (requestUser.role == "manager") {
            return res.status(400).json({ message: "Your are un authorized" });
        }

        await Admin.findByIdAndDelete({ _id: id });

        res.status(200).json({ message: "Admin deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server side error" });
    }
};

// ALL MANAGER GET -> ADMIN
module.exports.getAllManger = async (req, res) => {
    try {
        const data = await Admin.find({ role: { $ne: "superAdmin" } });
        res.status(200).send(data);
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: "server side error" });
    }
};

module.exports.addManager = async (req, res, next) => {
    try {
        const { email, password, currentUserEmail, role, name } =
            req.body || {};

        if (!email || !password || !currentUserEmail) {
            return res
                .status(400)
                .json({ message: "Email and password are required" });
        }
        const isExist = await Admin.findOne({ email: email });
        if (isExist) {
            return res.status(400).json({ message: "Email already exist!" });
        }

        const requestUser = await Admin.findOne({ email: currentUserEmail });

        if (!requestUser) {
            return res.status(400).json({ message: "this user not found" });
        }

        if (role === "superAdmin") {
            return res
                .status(401)
                .json({ message: "Super admin already created" });
        }
        console.log(requestUser);
        if (requestUser.role == "manager") {
            return res.status(401).json({ message: "Your are un authorized" });
        }

        // hash password
        const hasPassword = bcryptJs.hashSync(password);

        const managerData = new Admin({
            email: email,
            password: hasPassword,
            role: role,
            name: name,
        });

        await managerData.save();

        res.status(200).json({ message: "Success fully added manager" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "There was an server error" });
    }
};
