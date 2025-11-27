const express = require("express");
const {
  submitFeedback,
  getFormResponses,
  getFormAnalytics,
  createForm,
  getUserForms,
  getFormByLink,
  updateForm,
  deleteForm,
} = require("../controllers/feedbackControllers");
const requireSignin = require("../middleware/requireSignin");

const feedbackRouter = express.Router();

feedbackRouter.post("/submit", submitFeedback);
feedbackRouter.get("/form/:shareableLink", getFormByLink);

feedbackRouter.post("/create", requireSignin, createForm);
feedbackRouter.get("/user/forms", requireSignin, getUserForms);
feedbackRouter.get("/:formId/responses", requireSignin, getFormResponses);
feedbackRouter.get("/:formId/analytics", requireSignin, getFormAnalytics);
feedbackRouter.put("/:formId", requireSignin, updateForm);
feedbackRouter.delete("/:formId", requireSignin, deleteForm);

module.exports = feedbackRouter;
