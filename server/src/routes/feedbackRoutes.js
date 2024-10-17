const express = require("express");
const {
  createNewFeedback,
  getAllFeedback,
} = require("../controllers/feedbackControllers");
const requireApiToken = require("../middleware/requireApiToken");
const feedbackRouter = express.Router();

feedbackRouter.post("/create", requireApiToken, createNewFeedback);
feedbackRouter.get("/all", requireApiToken, getAllFeedback);

module.exports = feedbackRouter;
