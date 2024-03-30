const jwt = require("jsonwebtoken");

exports.generateToken = (userInfo) => {
  const payload = {
    email: userInfo.email,
    verified: userInfo.verified,
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "10days",
  });
  return token;
};
