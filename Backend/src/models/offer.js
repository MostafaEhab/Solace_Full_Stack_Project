const mongoose = require('mongoose');
const enums = require('./enums');

const OfferSchema = new mongoose.Schema(
  {
    requesterId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    executerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      enum: enums.Currency,
    },
    city: {
      type: String,
      enum: enums.City,
    },
    startDate: {
      type: Date,
      //default: Date.now,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    tags: {
      type: [String],
    },
    state: {
      type: String,
      enum: enums.OfferState,
      //required:true
    },
    appliedUserIds: {
      type: [mongoose.Schema.Types.ObjectId],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Offer', OfferSchema);
