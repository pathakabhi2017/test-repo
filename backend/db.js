const mongoose = require('mongoose');

const mongoURI = 'mongodb+srv://gaurav:3gANONaT61B5g4RP@cluster0.94qn5u5.mongodb.net/assessment_db_dev'

const connectToMongo = () => {
    mongoose.connect(mongoURI, () => {
        console.log('connected to mongo Successfully')
    })
}

module.exports = connectToMongo;