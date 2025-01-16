const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const questionSchema = new Schema(
  {
    question: {
      type: String,
      required: true,
    },

    score: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const feedbackSchema = new Schema(
  {
    organization: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    feedback: [questionSchema],
  },
  { timestamps: true }
);

const Feedback = mongoose.model("feedback", feedbackSchema);
module.exports = Feedback;
