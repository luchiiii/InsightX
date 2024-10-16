const transport = require("./smtpTransport");
const { EMAIL_USER } = require("../config/index");
const { homegraph_v1 } = require("googleapis");

const sendOtpToUser = (otp, email) => {
  const mailOptions = {
    from: EMAIL_USER,
    to: email,
    subject: "OTP VERIFICATION",
    html: `<h1>Your OTP is ${otp} </h1>`,
  };

  transport.sendMail(mailOptions, (error) => {
    if (error) {
      console.log(error);
    } else {
      console.log("OTP sent successfully");
    }
  });
};

//send password reset email
const sendPasswordResetEmail = (resetPasswordToken, email) => {
  const mailOptions = {
    from: EMAIL_USER,
    to: email,
    subject: "Password Reset Token",
    html: `<h1>Your Password rest token is ${resetPasswordToken}</h1>`,
  };

  transport.sendMail(mailOptions, (error) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent successfully");
    }
  });
};

module.exports = { sendOtpToUser, sendPasswordResetEmail };
