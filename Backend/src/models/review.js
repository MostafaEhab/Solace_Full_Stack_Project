const mongoose = require('mongoose');
const enums = require('./enums');

const ReviewSchema = new mongoose.Schema({
    offerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    reviewerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    revieweeId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        enum: enums.ReviewPoints,
    },
    description: {
        type: String,
    },
    reviewerType: {
        type: String,
        required: true,
        enum: enums.InteractionType,
    },
    revieweeType: {
        type: String,
        required: true,
        enum: enums.InteractionType,
    },
    tags: {
        type: [String],
        enum: enums.ReviewTag,
    },

}, { timestamps: true });

module.exports = mongoose.model("Review", ReviewSchema);