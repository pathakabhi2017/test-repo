import mongoose from "mongoose";

const UserScoreSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    answer_id: {
      type: mongoose.Types.ObjectId,
      ref: 'Answer'
    },
    max_marks: {
      type: Number,
      allowNull: false,
    },
    marks_Obtained: {
      type: Number,
      allowNull: false,
    },
    total_questions: {
      type: Number,
      allowNull: false,
    },
    total_attempted: {
      type: Number,
      allowNull: false,
    },
    categoryResult: {
      type: Object,
      allowNull: false,
    },
    examTypeId: {
      type: mongoose.Types.ObjectId,
      ref: "exam_type"

    },
    user_percentage: {
      type: Number,
      allowNull: false,
    },
    result: {
      type: String,
      allowNull: false,
    },
    examType: {
      type: String,
      allowNull: false
    },
    exam_name: {
      type: String,
      allowNull: false
    }
  },
  { timestamps: true }
);
export default mongoose.model("User_result", UserScoreSchema);
