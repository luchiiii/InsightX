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

    //generate a new otp for user verification
    const otp = generateOtp();
    
    //hash the provided password of the user
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    
    //calculate expiration times 
    const currentDate = new Date();
    const tokenExpiresIn = new Date(currentDate.getTime() + 30 * 60 * 1000); // 30 minutes from now
    const subscriptionExpires = new Date(currentDate.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days from now

    const newUser = new User({
      organizationName,
      email,
      password: hashedPassword,
      otp, 
      verificationTokenExpiresIn: tokenExpiresIn,
      subscriptionExpires: subscriptionExpires,
    });

    await newUser.save();
    
    //check if user info fails to save on database
    if (!newUser) {
      return res.status(400).json({ error: "user creation failed" });
    }
    
    //send the otp email to the created user
    try {
      await sendOtpToUser(otp, newUser.email);
      console.log(`OTP sent successfully to ${newUser.email}`);
    } catch (emailError) {
      console.error("Failed to send OTP email:", emailError);
      // Delete the user if email fails
      await User.findByIdAndDelete(newUser._id);
      return res.status(500).json({ 
        error: "Failed to send verification email. Please try again." 
      });
    }
    
    //return success response if operation is successful
    return res.status(201).json({ 
      message: "Account created Successfully. Please check your email for the OTP.",
      newUser: {
        id: newUser._id,
        email: newUser.email,
        organizationName: newUser.organizationName
      }
    });
  } catch (error) {
    console.error("Error in createNewUser:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

//verify new user function
const verifyUser = async (req, res) => {
  const { otp, email } = req.body; 
  try {
    const userExistsForVerification = await User.findOne({ email, otp });

    if (!userExistsForVerification) {
      return res.status(404).json({ error: "Invalid email or OTP" });
    }

    // Check if OTP field exists (user might have already been verified)
    if (!userExistsForVerification.otp) {
      return res.status(404).json({ error: "Invalid email or OTP" });
    }

    //check if otp has expired
    const now = new Date();
    const expiryTime = new Date(userExistsForVerification.verificationTokenExpiresIn);
    
    if (now > expiryTime) {
      await User.findByIdAndDelete(userExistsForVerification._id.toString());
      return res.status(403).json({ error: "Verification OTP has expired. Please sign up again." });
    }

    userExistsForVerification.otp = undefined;
    userExistsForVerification.verificationTokenExpiresIn = undefined;
    userExistsForVerification.isVerified = true;

    await userExistsForVerification.save();

    return res.status(200).json({ message: "User verified successfully" });
  } catch (error) {
    console.error("Error in verifyUser:", error);
    res.status(500).json({ error: "Server Error" });
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
    console.error("Error in getCurrentUser:", error);
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

    res.status(200).json({ 
      message: "Api token generated", 
      apiKey: currentUser.apiToken 
    });
  } catch (error) {
    console.error("Error in generateApiToken:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

module.exports = {
  createNewUser,
  verifyUser,
  getCurrentUser,
  generateApiToken,
};