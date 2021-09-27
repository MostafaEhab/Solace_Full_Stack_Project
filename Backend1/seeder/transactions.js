const TransactionModel = require("../src/models/transaction");
const enums = require("../src/models/enums");
const mongoose = require('mongoose');

const transactions = [
    new TransactionModel({
        offerId: mongoose.Types.ObjectId(),
        paymentId: 'XXX',
        fromId: mongoose.Types.ObjectId(),
        toId: mongoose.Types.ObjectId(),
        amount: 40,
        currency: enums.Currency.EURO,
        state: enums.TransactionState.SUCCESS,
        paymentType: enums.PaymentType.CREDIT,
        bankDetails: 'DB 1234 1234 1234 1234',
    }),
    new TransactionModel({
        offerId: mongoose.Types.ObjectId(),
        paymentId: 'YYY',
        fromId: mongoose.Types.ObjectId(),
        toId: mongoose.Types.ObjectId(),
        amount: 30,
        currency: enums.Currency.EURO,
        state: enums.TransactionState.REFUNDED,
        paymentType: enums.PaymentType.PAYPAL,
        bankDetails: 'user1@test.com',
    }),
    new TransactionModel({
        offerId: mongoose.Types.ObjectId(),
        paymentId: 'ZZZ',
        fromId: mongoose.Types.ObjectId(),
        toId: mongoose.Types.ObjectId(),
        amount: 20,
        currency: enums.Currency.DOLLAR,
        state: enums.TransactionState.FAILED,
        paymentType: enums.PaymentType.DEBIT,
        bankDetails: 'IBAN 1234 1234 1234 1234',
    }),
];

const seed = async () => {
    const count  = await TransactionModel.countDocuments();
    if (count === 0) {
        await TransactionModel.create(transactions);
        console.log('Dummy transactions seeded successfully.');
    }
}

module.exports = {
    seed,
}