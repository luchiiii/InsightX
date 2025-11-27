const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const questionSchema = new Schema(
  {
    questionId: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["rating", "text", "multiple-choice"],
      default: "rating",
    },
    required: {
      type: Boolean,
      default: true,
    },
    options: [String],
  },
  { _id: false }
);

const formSchema = new Schema(
  {
    organization: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    questions: [questionSchema],
    isActive: {
      type: Boolean,
      default: true,
    },
    shareableLink: {
      type: String,
      unique: true,
      sparse: true,
    },
    responseCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Form = mongoose.model("form", formSchema);
module.exports = Form;
