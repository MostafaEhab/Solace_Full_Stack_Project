const mongoose = require("mongoose");
const enums = require("./enums");

const TransactionSchema = new mongoose.Schema(
  {
    offerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    paymentId: {
      type: String,
      required: true,
    },
    fromId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    toId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
      enum: enums.Currency,
    },
    state: {
      type: String,
      required: true,
      enum: enums.TransactionState,
    },
    paymentType: {
      type: String,
      required: true,
      enum: enums.PaymentType,
    },
    bankDetails: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", TransactionSchema);
