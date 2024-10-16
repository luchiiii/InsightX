const express = require("express");
const { createNewFeedback } = require("../controllers/feedbackControllers");
const requireApiToken = require("../middleware/requireApiToken");
const feedbackRouter = express.Router();

feedbackRouter.post("/create", requireApiToken, createNewFeedback);

module.exports = feedbackRouter;
