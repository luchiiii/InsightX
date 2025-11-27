const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const responseSchema = new Schema(
  {
    questionId: {
      type: String,
      required: true,
    },
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: Schema.Types.Mixed,
      required: true,
    },
    type: {
      type: String,
      enum: ["rating", "text", "multiple-choice"],
      required: true,
    },
  },
  { _id: false }
);

const feedbackSchema = new Schema(
  {
    form: {
      type: Schema.Types.ObjectId,
      ref: "form",
      required: true,
    },
    organization: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    responses: [responseSchema],
    submittedVia: {
      type: String,
      enum: ["api", "dashboard"],
      default: "api",
    },
    ipAddress: String,
    userAgent: String,
  },
  { timestamps: true }
);

const Feedback = mongoose.model("feedback", feedbackSchema);
module.exports = Feedback;
