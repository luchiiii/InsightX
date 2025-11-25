const bcrypt = require("bcryptjs");
const User = require("../model/userModel");
const { generateToken, verifyToken } = require("../helpers/jwtHelpers");
const {
  ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN,
  JWT_SECRET,
} = require("../config/index");

//user login controller function
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userWithEmailExists = await User.findOne({ email });

    if (!userWithEmailExists) {
      return res.status(404).json({ error: "user with email does not exist" });
    }

    if (!userWithEmailExists.isVerified) {
      return res.status(403).json({
        error: "User account is not verified",
        unverified: true,      // flag to indicate unverified status
        email: userWithEmailExists.email // send email to prefill/identify user
  });
}

    const passwordMatch = bcrypt.compareSync(
      password,
      userWithEmailExists.password
    );

    if (!passwordMatch) {
      return res.status(403).json({ error: "Invalid login credentials" });
    }

    //declaration of payload
    const jwtPayload = {
      email: userWithEmailExists.email,
      userId: userWithEmailExists._id,
      organizationName: userWithEmailExists.organizationName,
    };

    //generate refresh token
    const refreshToken = generateToken(
      jwtPayload,
      JWT_SECRET,
      REFRESH_TOKEN_EXPIRES_IN
    );

    //generate access token

    const accessToken = generateToken(
      jwtPayload,
      JWT_SECRET,
      ACCESS_TOKEN_EXPIRES_IN
    );

    //cookie options
    const cookieOptions = {
      expires: new Date(Date.now() + 3600),
      maxAge: 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "none",
      secure: true,
    }; 

    return res
      .status(200)
      .cookie("accessToken", accessToken, cookieOptions)
      .json({ message: "user login successful", refreshToken });
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

//user logout controller function
const logoutUser = async (req, res) => {
  try {
    res
      .clearCookie("accessToken")
      .status(200)
      .json({ message: "User logout successful" });
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};
module.exports = { loginUser, logoutUser };
