const mongoose = require('mongoose');
const { Schema } = mongoose;

const CategorySchemeType = new Schema({
    name: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('categories', CategorySchemeType);

