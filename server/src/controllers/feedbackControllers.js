const Feedback = require("../model/feedbackModel");

//create new feedback

const createNewFeedback = async (req, res) => {
    const { userId: organizationId } = req.user;

  const { questions } = req.body;

  
  try {
    // Create new feedback document
    const newFeedback = new Feedback({
      organization:organizationId ,
      feedback: questions, // Capturing the question and score in an array
    });

    //save the feedback in the database
    await newFeedback.save();

    //send success response
    res
      .status(200)
      .json({ message: "Feedback created successfully", newFeedback });
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

//get all feedback
const getAllFeedback = async (req, res) => {
  const { userId: organizationId } = req.user;
  try {
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

module.exports = { createNewFeedback };
