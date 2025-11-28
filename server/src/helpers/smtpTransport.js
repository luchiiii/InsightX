const nodemailer = require("nodemailer");
const { EMAIL_USER, EMAIL_APP_PASSWORD } = require("../config/index");

const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_APP_PASSWORD,
  },
});

module.exports = transport;
