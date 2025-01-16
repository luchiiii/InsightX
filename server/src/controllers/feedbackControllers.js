// controllers/feedbackController.js

const Feedback = require("../model/feedbackModel");
const { calculateNPS } = require("../helpers/npsCalculator");

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

    const npsAnalytics = calculateNPS(feedbacks);

    res.status(200).json({
      message: "Feedbacks retrieved successfully",
      npsAnalytics,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server Error" });
  }
};

module.exports = { createNewFeedback, getAllFeedback };
