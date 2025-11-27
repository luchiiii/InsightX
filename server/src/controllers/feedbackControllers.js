const Feedback = require("../model/feedbackModel");
const Form = require("../model/formModel");
const User = require("../model/userModel");
const { calculateNPS } = require("../helpers/npsCalculator");

const submitFeedback = async (req, res) => {
  const { formId, responses } = req.body;

  try {
    const form = await Form.findById(formId);

    if (!form || !form.isActive) {
      return res.status(404).json({ error: "Form not found or inactive" });
    }

    const newFeedback = new Feedback({
      form: formId,
      organization: form.organization,
      responses,
      submittedVia: "api",
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    });

    await newFeedback.save();

    await Form.findByIdAndUpdate(
      formId,
      { $inc: { responseCount: 1 } },
      { new: true }
    );

    res.status(201).json({
      success: true,
      message: "Feedback submitted successfully",
      data: { id: newFeedback._id },
    });
  } catch (error) {
    console.error("Submit feedback error:", error);
    res.status(500).json({ error: "Failed to submit feedback" });
  }
};

const getFormResponses = async (req, res) => {
  const { userId } = req.user;
  const { formId } = req.params;

  try {
    const form = await Form.findById(formId);

    if (!form) {
      return res.status(404).json({ error: "Form not found" });
    }

    if (form.organization.toString() !== userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const responses = await Feedback.find({ form: formId }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      data: responses,
      count: responses.length,
    });
  } catch (error) {
    console.error("Get responses error:", error);
    res.status(500).json({ error: "Failed to retrieve responses" });
  }
};

const getFormAnalytics = async (req, res) => {
  const { userId } = req.user;
  const { formId } = req.params;

  try {
    const form = await Form.findById(formId);

    if (!form) {
      return res.status(404).json({ error: "Form not found" });
    }

    if (form.organization.toString() !== userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const responses = await Feedback.find({ form: formId });

    const npsData = calculateNPS(responses);

    const questionStats = {};
    form.questions.forEach((question) => {
      questionStats[question.questionId] = {
        question: question.text,
        type: question.type,
        responses: [],
        average: 0,
      };
    });

    responses.forEach((feedback) => {
      feedback.responses.forEach((response) => {
        if (questionStats[response.questionId]) {
          questionStats[response.questionId].responses.push(response.answer);
        }
      });
    });

    Object.keys(questionStats).forEach((qId) => {
      const answers = questionStats[qId].responses;
      if (answers.length > 0 && questionStats[qId].type === "rating") {
        const average = answers.reduce((a, b) => a + b, 0) / answers.length;
        questionStats[qId].average = Math.round(average * 10) / 10;
      }
    });

    res.status(200).json({
      success: true,
      data: {
        nps: npsData,
        questionStats,
        totalResponses: responses.length,
        formTitle: form.title,
      },
    });
  } catch (error) {
    console.error("Get analytics error:", error);
    res.status(500).json({ error: "Failed to retrieve analytics" });
  }
};

const createForm = async (req, res) => {
  const { userId } = req.user;
  const { title, description, questions } = req.body;

  try {
    if (!title || !questions || questions.length === 0) {
      return res
        .status(400)
        .json({ error: "Title and questions are required" });
    }

    const shareableLink = `form-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    const newForm = new Form({
      organization: userId,
      title,
      description,
      questions,
      shareableLink,
    });

    await newForm.save();

    res.status(201).json({
      success: true,
      message: "Form created successfully",
      data: newForm,
    });
  } catch (error) {
    console.error("Create form error:", error);
    res.status(500).json({ error: "Failed to create form" });
  }
};

const getUserForms = async (req, res) => {
  const { userId } = req.user;

  try {
    const forms = await Form.find({ organization: userId }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      data: forms,
      count: forms.length,
    });
  } catch (error) {
    console.error("Get user forms error:", error);
    res.status(500).json({ error: "Failed to retrieve forms" });
  }
};

const getFormByLink = async (req, res) => {
  const { shareableLink } = req.params;

  try {
    const form = await Form.findOne({ shareableLink, isActive: true }).select(
      "-organization"
    );

    if (!form) {
      return res.status(404).json({ error: "Form not found" });
    }

    res.status(200).json({
      success: true,
      data: form,
    });
  } catch (error) {
    console.error("Get form by link error:", error);
    res.status(500).json({ error: "Failed to retrieve form" });
  }
};

const updateForm = async (req, res) => {
  const { userId } = req.user;
  const { formId } = req.params;
  const { title, description, questions, isActive } = req.body;

  try {
    const form = await Form.findById(formId);

    if (!form) {
      return res.status(404).json({ error: "Form not found" });
    }

    if (form.organization.toString() !== userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const updatedForm = await Form.findByIdAndUpdate(
      formId,
      { title, description, questions, isActive },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Form updated successfully",
      data: updatedForm,
    });
  } catch (error) {
    console.error("Update form error:", error);
    res.status(500).json({ error: "Failed to update form" });
  }
};

const deleteForm = async (req, res) => {
  const { userId } = req.user;
  const { formId } = req.params;

  try {
    const form = await Form.findById(formId);

    if (!form) {
      return res.status(404).json({ error: "Form not found" });
    }

    if (form.organization.toString() !== userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await Form.findByIdAndDelete(formId);
    await Feedback.deleteMany({ form: formId });

    res.status(200).json({
      success: true,
      message: "Form deleted successfully",
    });
  } catch (error) {
    console.error("Delete form error:", error);
    res.status(500).json({ error: "Failed to delete form" });
  }
};

module.exports = {
  submitFeedback,
  getFormResponses,
  getFormAnalytics,
  createForm,
  getUserForms,
  getFormByLink,
  updateForm,
  deleteForm,
};
