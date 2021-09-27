const OfferModel = require("../src/models/offer");
const enums = require("../src/models/enums");
const mongoose = require('mongoose');

const offers = [
    new OfferModel({
        requesterId: mongoose.Types.ObjectId(),
        title: 'Offer 1',
        description: 'Description of offer 1',
        price: 40,
        currency: enums.Currency.EURO,
        city: enums.City.MUNICH,
        startDate: Date.now(),
        endDate: Date.now() + 1000000,
        state: enums.OfferState.NEW,
    }),
    new OfferModel({
        requesterId: mongoose.Types.ObjectId(),
        executerId: mongoose.Types.ObjectId(),
        title: 'Offer 2',
        description: 'Description of offer 2',
        price: 50,
        currency: enums.Currency.DOLLAR,
        city: enums.City.NEW_YORK,
        startDate: Date.now(),
        endDate: Date.now() + 1000000,
        state: enums.OfferState.MATCHED,
    }),
    new OfferModel({
        requesterId: mongoose.Types.ObjectId(),
        title: 'Offer 3',
        description: 'Description of offer 3',
        price: 20,
        currency: enums.Currency.EURO,
        city: enums.City.BERLIN,
        startDate: Date.now(),
        endDate: Date.now() + 1000000,
        state: enums.OfferState.NEW,
    }),
];

const seed = async () => {
    const count  = await OfferModel.countDocuments();
    if (count === 0) {
        await OfferModel.create(offers);
        console.log('Dummy offers seeded successfully.');
    }
}

module.exports = {
    seed,
}