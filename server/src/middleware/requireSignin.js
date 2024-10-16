const { verifyToken } = require("../helpers/jwtHelpers");
const { JWT_SECRET } = require("../config/index");

//require sign in middleware function

const requireSignin = async (req, res, next) => {
  try {
    console.log(req.cookies);
    const { accessToken } = req.cookies;

    if (!accessToken) {
      return res.status(409).json({ error: "Access Denied" });
    }

    const payload = verifyToken(accessToken, JWT_SECRET);

    if (!payload) {
      return res.status(403).json({ error: "Invalid Token" });
    }

    req.user = payload;

    next();
  } catch (error) {
    res.status(403).json({ error: "Invalid Token" });
  }
};

module.exports = requireSignin;
