const express = require("express");
const { loginUser, logoutUser } = require("../controllers/authControllers");
const requireSignin = require("../middleware/requireSignin");
const authRouter = express.Router();

authRouter.post("/login", loginUser);
authRouter.get("/logout", requireSignin, logoutUser);

module.exports = authRouter;
