import mongoose from "mongoose";

const ExamTypeSchema = mongoose.Schema({
  exam_name: {
    type: String,
    required: true,
  },

  exam_categories: {
    type: [
      {
        category_id: {
          type: mongoose.Types.ObjectId,
          ref: "categories",
        },

        number_of_questions: {
          type: Number,
        },
      },
    ],
  },
  percentage: {
    type: Number,
    allowNull: false,
    required: true,
  },
  date: {
    type: Date,

    default: Date.now,
  },
  status: {
    type: String,
  },
  slug: {
    type: String,
    required: true
  },
  exam_time: {
    type: Number,
    default: 0
  }
});

export default mongoose.model("exam_type", ExamTypeSchema);
