const { verifyToken } = require("../helpers/jwtHelpers");
const { API_JWT_SECRET } = require("../config/index");

//require api token middleware function

const requireApiToken = async (req, res, next) => {
  try {
    const headers = req.headers["authorization"];

    if (headers.split(" ")[0] !== "Bearer") {
      return res.status(403).json({ error: "Invalid Token" });
    }

    const apiToken = headers.split(" ")[1];

    const payload = verifyToken(apiToken, API_JWT_SECRET);

    if (!payload) {
      return res.status(403).json({ error: "Invalid Token" });
    }

    req.user = payload;

    next();
  } catch (error) {
    res.status(403).json({ error: "Invalid Token" });
  }
};

module.exports = requireApiToken;
