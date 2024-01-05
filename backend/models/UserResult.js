const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserResultSchema = new Schema({
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
},
    { timestamps: true }


);
module.exports = mongoose.model('user_results', UserResultSchema); //exam is model name