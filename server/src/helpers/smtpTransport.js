const nodemailer = require("nodemailer");
const { EMAIL_USER, EMAIL_APP_PASSWORD } = require("../config/index");

const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_APP_PASSWORD,
  },
});

// Verify connection on startup
transport.verify((error, success) => {
  if (error) {
    console.error("SMTP Transport Error:", error);
  } else {
    console.log("SMTP Transport is ready to send emails");
  }
});

module.exports = transport;