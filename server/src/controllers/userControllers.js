const bcrypt = require("bcryptjs");
const User = require("../model/userModel");
const generateOtp = require("../helpers/generateToken");
const { sendOtpToUser } = require("../helpers/emailHelpers");
const { generateToken } = require("../helpers/jwtHelpers");

const createNewUser = async (req, res) => {
  const { organizationName, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(409).json({ error: "User already exists" });
    }

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
      console.log(`OTP sent to ${newUser.email}`);
    } catch (emailError) {
      console.error("Email error:", emailError.message);
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
    console.error("Create user error:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

const verifyUser = async (req, res) => {
  const { otp, email } = req.body;

  try {
    console.log("Verify request - Email:", email, "OTP:", otp, "OTP Type:", typeof otp);
    
    const user = await User.findOne({ email, otp });
    console.log("User found with email+otp?", !!user);

    if (!user) {
      const userByEmail = await User.findOne({ email });
      if (userByEmail) {
        console.log("User found by email only");
        console.log("Stored OTP:", userByEmail.otp, "Type:", typeof userByEmail.otp);
        console.log("Received OTP:", otp, "Type:", typeof otp);
        console.log("OTPs match?", userByEmail.otp === otp);
      }
      return res.status(404).json({ error: "Invalid email or OTP" });
    }

    if (!user.otp) {
      return res.status(404).json({ error: "Invalid email or OTP" });
    }

    const now = new Date();
    const expiryTime = new Date(user.verificationTokenExpiresIn);
    
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
    console.error("Verify user error:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

const getCurrentUser = async (req, res) => {
  const { userId } = req.user;

  try {
    const currentUser = await User.findById(userId).select("-password");

    if (!currentUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User found", currentUser });
  } catch (error) {
    console.error("Get current user error:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

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
      return res.status(403).json({ error: "Token generation failed" });
    }

    currentUser.apiToken = apiToken;
    await currentUser.save();

    res.status(200).json({ 
      message: "Api token generated", 
      apiKey: currentUser.apiToken 
    });
  } catch (error) {
    console.error("Generate API token error:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  createNewUser,
  verifyUser,
  getCurrentUser,
  generateApiToken,
};