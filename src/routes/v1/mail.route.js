const express = require("express");
const { transport } = require("../../config/mailTransport");
const { getReceiverEmail } = require("../../controllers/user.controller");
const router = express.Router();

// sending email (testing phase)
router.post("/send", async (req, res, next) => {
  try {
    // call the function to get users email
    const emailTo = await getReceiverEmail(req.body.to);

    if (emailTo.length < 1) {
      return res.status(400).json({ message: "This type user not found" });
    }
    let mailOptions = {
      from: process.env.EMAIL_FROM,
      to: emailTo,
      subject: req.body.subject,
      text: "",
      html: req.body.emailBody,
    };

    let data = await transport.sendMail(mailOptions);

    res.status(200).json({ message: "Mail has been sent successfully" });
  } catch (err) {
    res.status(500).json({ message: "There was a server side error", err });
  }
});

module.exports = router;
