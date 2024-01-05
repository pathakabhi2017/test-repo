const mongoose = require('mongoose');
const { Schema } = mongoose;

const ResultSchema = new Schema(
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
        }

    },

    { timestamps: true }
);
module.exports = mongoose.model('answers', ResultSchema); //exam is model name