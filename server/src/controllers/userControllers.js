const bcrypt = require("bcryptjs");
const User = require("../model/userModel");
const generateOtp = require("../helpers/generateToken");
const { sendOtpToUser } = require("../helpers/emailHelpers");
const { generateToken } = require("../helpers/jwtHelpers");


//create new user
const createNewUser = async (req, res) => {
  const { organizationName, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(409).json({ error: "User already exists" });
    }

    //generate otp and hash password
    const otp = generateOtp();
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    
    const currentDate = new Date();
    const tokenExpiresIn = new Date(currentDate.getTime() + 30 * 60 * 1000);
    const subscriptionExpires = new Date(currentDate.getTime() + 30 * 24 * 60 * 60 * 1000);

    const newUser = new User({
      organizationName,
      email,
      password: hashedPassword,
      otp, 
      verificationTokenExpiresIn: tokenExpiresIn,
      subscriptionExpires: subscriptionExpires,
    });

    await newUser.save();

    if (!newUser) {
      return res.status(400).json({ error: "user creation failed" });
    }
    
    try {
      await sendOtpToUser(otp, newUser.email);
    } catch (emailError) {
      //Delete the created user if email sending fails
      await User.findByIdAndDelete(newUser._id);
      return res.status(500).json({ error: "Failed to send verification email" });
    }
    
    return res.status(201).json({ 
      message: "Account created. Check your email for OTP.",
      newUser: {
        id: newUser._id,
        email: newUser.email,
        organizationName: newUser.organizationName
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

//verify user function
const verifyUser = async (req, res) => {
  const { otp, email } = req.body;

  try {
    const user = await User.findOne({ email, otp });

    if (!user) {
      return res.status(404).json({ error: "Invalid email or OTP" });
    }

    if (!user.otp) {
      return res.status(404).json({ error: "Invalid email or OTP" });
    }

    const now = new Date();
    const expiryTime = new Date(user.verificationTokenExpiresIn);
    

    //delete unverified user if otp has expired
    if (now > expiryTime) {
      await User.findByIdAndDelete(user._id);
      return res.status(403).json({ error: "OTP expired. Sign up again." });
    }

    user.otp = undefined;
    user.verificationTokenExpiresIn = undefined;
    user.isVerified = true;

    await user.save();

    return res.status(200).json({ message: "User verified successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};


//get current user function
const getCurrentUser = async (req, res) => {
  const { userId } = req.user;

  try {
    const currentUser = await User.findById(userId).select("-password");

    if (!currentUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User found", currentUser });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};


//generate API token function
const generateApiToken = async (req, res) => {
  const { userId } = req.user;

  try {
    const currentUser = await User.findById(userId);

    if (!currentUser) {
      return res.status(404).json({ error: "User not found" });
    }


    //token generation with 30 days expiration date
    const apiToken = generateToken(
      { userId: currentUser._id.toString() },
      process.env.API_JWT_SECRET,
      "30d"
    );

    if (!apiToken) {
      return res.status(403).json({ error: "Token generation failed" });
    }

    currentUser.apiToken = apiToken;
    await currentUser.save();

    res.status(200).json({ 
      message: "Api token generated", 
      apiKey: currentUser.apiToken 
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  createNewUser,
  verifyUser,
  getCurrentUser,
  generateApiToken,
};