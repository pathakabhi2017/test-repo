const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
    FirstName: {
        type: String,
        required: true
    },
    LastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    center: {
        type: String,
        required: true
    },
    status: {
        type: Number,
        required: true,
        default: 1,
    },
    date: {
        type: Date,
        default: Date.now
    }
});
const User = mongoose.model('user', UserSchema);
// User.createIndexes();
module.exports = User;