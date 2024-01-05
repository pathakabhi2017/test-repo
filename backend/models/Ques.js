const mongoose = require("mongoose");
const { Schema } = mongoose;

const QuesSchema = new Schema({
  question: {
    type: String,
    required: true,
  },
  options: {
    type: Array,
  },
  answer: {
    type: Number,
    required: true,
  },
  category: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("questions", QuesSchema); //ques is model name
