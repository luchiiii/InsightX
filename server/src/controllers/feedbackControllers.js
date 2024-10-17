// controllers/feedbackController.js

const Feedback = require("../model/feedbackModel");
const { calculateNPSForQuestions } = require("../helpers/npsCalculator");

const createNewFeedback = async (req, res) => {
  const { userId: organizationId } = req.user;
  const { questions } = req.body;

  try {
    const newFeedback = new Feedback({
      organization: organizationId,
      feedback: questions,
    });

    await newFeedback.save();

    res.status(200).json({
      success: true,
      data: newFeedback,
      message: "Feedback created successfully",
    });
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

const getAllFeedback = async (req, res) => {
  const { userId: organizationId } = req.user;
  try {
    const feedbacks = await Feedback.find({ organization: organizationId });

    if (!feedbacks || feedbacks.length === 0) {
      return res.status(404).json({
        error: "No feedbacks found for this organization",
      });
    }

    const npsAnalytics = calculateNPSForQuestions(feedbacks);

    res.status(200).json({
      success: true,
      data: {
        feedbacks,
        npsAnalytics,
      },
      message: "Feedbacks retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

module.exports = { createNewFeedback, getAllFeedback };
