const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    organizationName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: String,
    },
    verificationToken: {
      type: String,
    },
    verificationTokenExpiresIn: {
      type: Date,
      default: Date.now(),
    },
    resetPasswordToken: {
      type: String,
    },
    apiToken: {
      type: String,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    subscriptionExpires: {
      type: Date,
      default: Date.now(),
    },
  },
  { timestamps: true }
);

const User = mongoose.model("user", userSchema);
module.exports = User;