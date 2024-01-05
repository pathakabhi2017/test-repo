import mongoose from "mongoose";
const createAnswerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    answer: {
      type: Array,
      required: true,
      allowNull: false,
    },
    answerFlag: {
      type: Boolean,
      required: true,
      default: false,
      allowNull: false,
    },
    examType: {
      type: String,
      allowNull: false
    },
    examTypeId: {
      type: mongoose.Types.ObjectId,
      ref: 'exam_type'
    },
    exam_name: {
      type: String,
      allowNull: false
    }
  },

  { timestamps: true }
);
export default mongoose.model("Answer", createAnswerSchema);
