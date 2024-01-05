import mongoose from "mongoose";

const createQuestionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      unique: true,
      allowNull: false,
    },
    option: {
      type: Array,
      required: true,
      allowNull: false,
      unique: false,
    },
    answer: {
      type: Number,
      required: true,
      unique: true,
      allowNull: false,
    },
    category: {
      type: String,
      required: true,
      allowNull: false,
    },
  },
  { timestamps: true }
);
export default mongoose.model("Question", createQuestionSchema);
