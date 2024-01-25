const validator = require("validator");

exports.adminRegisterValidate = (user) => {
  let error = {};

  if (!user.name) {
    error.name = "Please Provide Your Name";
  }

  if (!user.email) {
    error.email = "Please Provide Your Email";
  } else if (!validator.isEmail(user.email)) {
    error.email = "Please provide a valid email";
  }

  if (!user.password) {
    error.password = "Please Provide a Password";
  } else if (user.password.length < 6) {
    error.password = "Password must be greater or equal to 6 Characters.";
  }

  if (!user.confirmPassword) {
    error.confirmPassword = "Please provide confirmation password.";
  } else if (user.password !== user.confirmPassword) {
    error.confirmPassword = "Password doesn't match.";
  }
  return {
    error,
    isValid: Object.keys(error).length === 0,
  };
};
exports.userRegisterValidator = (user) => {
  let error = {};

  if (!user.name) {
    error.name = "Please Provide Your Name";
  }
  if (!user.gender) {
    error.gender = "Please Provide gender";
  }
  if (!user.phone) {
    error.phone = "Please Provide phone number";
  }

  if (!user.email) {
    error.email = "Please Provide Your Email";
  } else if (!validator.isEmail(user.email)) {
    error.email = "Please provide a valid email";
  }

  if (!user.password) {
    error.password = "Please Provide a Password";
  } else if (user.password.length < 6) {
    error.password = "Password must be greater or equal to 6 Characters.";
  }

  if (!user.confirmPassword) {
    error.confirmPassword = "Please provide confirmation password.";
  } else if (user.password !== user.confirmPassword) {
    error.confirmPassword = "Password doesn't match.";
  }
  return {
    error,
    isValid: Object.keys(error).length === 0,
  };
};
