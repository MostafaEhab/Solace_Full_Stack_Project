const ReviewModel = require("../src/models/review");
const enums = require("../src/models/enums");
const mongoose = require('mongoose');

const reviews = [
    new ReviewModel({
        offerId: mongoose.Types.ObjectId(),
        reviewerId: mongoose.Types.ObjectId(),
        revieweeId: mongoose.Types.ObjectId(),
        rating: 4,
        reviewerType: enums.InteractionType.EXECUTER,
        revieweeType: enums.InteractionType.REQUESTER,
    }),
    new ReviewModel({
        offerId: mongoose.Types.ObjectId(),
        reviewerId: mongoose.Types.ObjectId(),
        revieweeId: mongoose.Types.ObjectId(),
        rating: 3,
        reviewerType: enums.InteractionType.REQUESTER,
        revieweeType: enums.InteractionType.EXECUTER,
    }),
    new ReviewModel({
        offerId: mongoose.Types.ObjectId(),
        reviewerId: mongoose.Types.ObjectId(),
        revieweeId: mongoose.Types.ObjectId(),
        rating: 3.5,
        reviewerType: enums.InteractionType.EXECUTER,
        revieweeType: enums.InteractionType.REQUESTER,
    }),
];

const seed = async () => {
    const count  = await ReviewModel.countDocuments();
    if (count === 0) {
        await ReviewModel.create(reviews);
        console.log('Dummy reviews seeded successfully.');
    }
}

module.exports = {
    seed,
}