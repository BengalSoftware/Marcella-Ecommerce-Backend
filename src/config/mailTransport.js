const nodemailer = require("nodemailer");
const smtp = require("nodemailer-smtp-transport");
require("dotenv").config();

exports.transport = nodemailer.createTransport(
  smtp({
    host: "in.mailjet.com",
    port: 2525,
    auth: {
      user: process.env.MAILJET_API_KEY || "7745a8d2fe2422cde9f7da07bc05aa86",
      pass:
        process.env.MAILJET_API_SECRET || "a81195c856a1ddf7f94b9c808e53bf5b",
    },
  })
);
