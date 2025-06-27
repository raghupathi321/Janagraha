// models/Evaluation.js
const mongoose = require('mongoose');

const evaluationSchema = new mongoose.Schema({
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true,
    },
    judgeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    scores: {
        type: [Number],
        required: true,
        validate: {
            validator: (array) => array.length === 5 && array.every((score) => Number.isInteger(score) && score >= 0 && score <= 5),
            message: 'Scores must be an array of 5 integers between 0 and 5',
        },
    },
    comments: {
        type: String,
        trim: true,
    },
    submittedAt: {
        type: Date,
        default: Date.now,
    },
});

evaluationSchema.index({ projectId: 1, judgeId: 1 }, { unique: true });

module.exports = mongoose.model('Evaluation', evaluationSchema);