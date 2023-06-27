const mongoose = require('mongoose')

const lunchesSchema = new mongoose.Schema({
    flightNumber: {
        type: Number,
        required: true,
    },
    launchDate: {
        type: Date,
        required: true,
    },
    mission: {
        type: String,
        required: true,
    },
    rocket: {
        type: String,
        required: true,
    },
    target: {
        type: String,
       
        ref: "Planet",
    },
    customers: [String],
    upcoming: {
        type: Boolean,
        required: true,
        default: true
    },
    success: {
        type: Boolean,
        required: true,
        default: true,
    }

})
// Connect lunchesSchema with the "launches" collection
module.exports = mongoose.model('Launch', lunchesSchema)

// type: Number,
// requireed: true,
// default: 100,
// min: 100,
// max: 999,