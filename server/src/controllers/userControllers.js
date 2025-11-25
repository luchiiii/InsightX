const bcrypt = require("bcryptjs");
const User = require("../model/userModel");
const generateOtp = require("../helpers/generateToken");
const { sendOtpToUser } = require("../helpers/emailHelpers");
const { generateToken } = require("../helpers/jwtHelpers");
const { API_JWT_SECRET } = require("../config/index");

//create new user
const createNewUser = async (req, res) => {
  const { organizationName, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(409).json({ error: "User already exists" });
    }

    //create a new user
    //generate a new otp || verification token
    const verificationToken = generateOtp();
    //hash the provided password of the user
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    //save the token and the hash password on the database
    //create a new instance of user from User model
    let currentDate = new Date();

    const newUser = new User({
      organizationName,
      email,
      password: hashedPassword,
      verificationToken,
      verificationTokenExpiresIn: new Date(currentDate.getTime() + 30 * 60 * 1000),
      subscriptionExpires: currentDate.setMonth(currentDate.getMonth() + 1),
    });

    await newUser.save();
    //check if user info fails to save on database
    if (!newUser) {
      return res.status(400).json({ error: "user creation failed" });
    }
    //send a generated otp email to the created user
    sendOtpToUser(newUser.verificationToken, newUser.email);
    //return success response if operation is successful
    return res
      .status(201)
      .json({ message: "Account created Successfully", newUser });
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

//verify new user function
const verifyUser = async (req, res) => {
  const { verificationToken } = req.body;

  try {
    const userExistsForVerification = await User.findOne({ verificationToken });

    if (!userExistsForVerification) {
      return res.status(404).json({ error: "Invalid verification token" });
    }

    const now = new Date();
    const tokenExpiryDate = new Date(
      userExistsForVerification.verificationTokenExpiresIn
    );

    if (
      now >= tokenExpiryDate
    ) {
      await User.findByIdAndDelete(userExistsForVerification._id.toString());

      return res.status(403).json({ error: "Expired verification token" });
    }

    userExistsForVerification.verificationToken = undefined;
    userExistsForVerification.verificationTokenExpiresIn = undefined;
    userExistsForVerification.isVerified = true;

    await userExistsForVerification.save();

    return res.status(200).json({ message: "User verified successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
    console.log(error);
  }
};

//get current user information
const getCurrentUser = async (req, res) => {
  const { userId } = req.user;

  try {
    const currentUser = await User.findById(userId).select("-password");

    if (!currentUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User found", currentUser });
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

//generate api token for user
const generateApiToken = async (req, res) => {
  const { userId } = req.user;
  try {
    const currentUser = await User.findById(userId);

    if (!currentUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const apiToken = generateToken(
      { userId: currentUser._id.toString() },
      process.env.API_JWT_SECRET,
      "30d"
    );

    if (!apiToken) {
      return res.status(403).json({ error: "Api token generation failed" });
    }

    currentUser.apiToken = apiToken;

    await currentUser.save();

    res
      .status(200)
      .json({ message: "Api token generated", apiKey: currentUser?.apiToken });
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

module.exports = {
  createNewUser,
  verifyUser,
  getCurrentUser,
  generateApiToken,
};
