const express = require("express");
const {
  createNewUser,
  verifyUser,
  getCurrentUser,
  generateApiToken,
} = require("../controllers/userControllers");
const requireSignin = require("../middleware/requireSignin");
const {
  validateInput,
  checkValidationErrors,
} = require("../middleware/dataValidator");
const userRouter = express.Router();

userRouter.post("/", validateInput(), checkValidationErrors, createNewUser);
userRouter.put("/verify", verifyUser);
userRouter.get("/me", requireSignin, getCurrentUser);
userRouter.get("/token", requireSignin, generateApiToken);

module.exports = userRouter;
