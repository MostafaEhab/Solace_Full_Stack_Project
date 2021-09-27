const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    // Hash of the password is stored.
    password: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    profilePicture: {
        type: Buffer,
    },
    identificationImg: {
        type: Buffer,
    },
    requesterRating: {
        type: Number,
    },
    // Needed to get a quick running average.
    requesterRatingCount: {
        type: Number,
    },
    executerRating: {
        type: Number,
    },
    // Needed to get a quick running average.
    executerRatingCount: {
        type: Number,
    },
    phoneNumber: {
        type: String,
    },
    address: {
        type: String,
    },
    paypalEmail: {
        type: String,
    },
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);