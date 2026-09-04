const mongoose = require("mongoose")
const attemptSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    topic: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Topic",
        reqquired: true
    },
    submissionId: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        required: true
    },
    totalQuestions: {
        type: Number,
        required: true
    },
    correctAnswers: {
        type: Number,
        required: true
    }
}, {
    timestamps: true

});

module.exports = mongoose.model("Attempt", attemptSchema)