const mongoose = require('mongoose');
const { Schema } = mongoose;

const ExamTypeSchema = new Schema({

    exam_name: {
        type: String,
        required: true
    },
    passcode: {
        type: String,
        required: true,
    },
    percentage: {
        type: Number,
        required: true,
    },
    exam_time: {
        type: Number,
        required: true,
    },
    exam_categories: {
        type: [
            {
                category_id: {
                    type: mongoose.Types.ObjectId,
                },
                number_of_questions: {
                    type: Number
                }
            }
        ],


    },
    status: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        require: true
    },
    image: { type: String },
    content: { type: String },
    date: {
        type: Date,
        default: Date.now
    }
});
module.exports = mongoose.model('exam_type', ExamTypeSchema); 