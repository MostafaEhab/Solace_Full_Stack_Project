const ReviewModel = require("../models/review");
const enums = require("../models/enums");
const UserModel = require("../models/user");
const OfferModel = require("../models/offer");
const list = async (req, res) => {
  try {
    let reviewsAsRequester = await ReviewModel.find({
      revieweeId: req.user.id,
      revieweeType: enums.InteractionType.REQUESTER,
    }).exec();
    let reviewsAsExecuter = await ReviewModel.find({
      revieweeId: req.user.id,
      revieweeType: enums.InteractionType.EXECUTER,
    }).exec();
    return res.status(200).json({
      reviewsAsRequester: reviewsAsRequester,
      reviewsAsExecuter: reviewsAsExecuter,
    });
  } catch (err) {
    return res.status(500).json({
      error: "Internal server error",
      message: err.message,
    });
  }
};

const getReviewOnOffer = async (req, res) => {
  try {
    let review = await ReviewModel.find({offerId: req.params.id, reviewerId: req.user.id}).exec();

    if (!review)
      return res.status(404).json({
        error: "Not Found",
        message: `Review not found`,
      });

    return res.status(200).json(review);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: "Internal Server Error",
      message: err.message,
    });
  }
};

const read = async (req, res) => {
  try {
    let review = await ReviewModel.findById(req.params.id).exec();

    if (!review)
      return res.status(404).json({
        error: "Not Found",
        message: `Review not found`,
      });

    return res.status(200).json(review);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: "Internal Server Error",
      message: err.message,
    });
  }
};

// Creates a review given offerId, revieweeId, rating, description, reviewerType, revieweeType and tags.
// The user must be logged in, in order to create an offer.
// The user can only create an offer with their own requester id.
// Also updates avg rating for the reviewee.

const create = async (req, res) => {
  if (Object.keys(req.body).length === 0)
    return res.status(400).json({
      error: "Bad Request",
      message: "The request body is empty",
    });

  const { offerId, rating, description, tags } = req.body;

  //Build review object
  const reviewFields = {};
  const mongoose = require("mongoose");
  const reviewerId = req.user.id;

  if (offerId) reviewFields.offerId = mongoose.Types.ObjectId(offerId);
  if (reviewerId) reviewFields.reviewerId = mongoose.Types.ObjectId(reviewerId);
  if (rating) reviewFields.rating = rating;
  if (description) reviewFields.description = description;

  if (tags) {
    reviewFields.tags = tags.split(",").map((tag) => tag.trim());
  }
  try {
    let offer = await OfferModel.findById(offerId).exec();

    if (offer.state !== "COMPLETED") {
      return res.status(400).json({
        error: "Bad request",
        message: "You cannot do a review until the offer is completed",
      });
    }
    if (
      !offer._id ||
      (reviewerId != offer.executerId && reviewerId != offer.requesterId)
    ) {
      return res.status(403).json({
        error: "Forbidden",
        message: "You do not have permission to access this path",
      });
    } else if (reviewerId == offer.executerId) {
      reviewFields.revieweeId = offer.requesterId;
      reviewFields.reviewerType = enums.InteractionType.EXECUTER;
      reviewFields.revieweeType = enums.InteractionType.REQUESTER;
    } else {
      reviewFields.revieweeId = offer.executerId;
      reviewFields.reviewerType = enums.InteractionType.REQUESTER;
      reviewFields.revieweeType = enums.InteractionType.EXECUTER;
    }
    let review = new ReviewModel(reviewFields);
    await review.save();
    const reviewed = await UserModel.findById(reviewFields.revieweeId).exec();
    const avgRatingFields = calculateAverageCreate(
      reviewFields.revieweeType,
      reviewed,
      rating
    );
    await UserModel.findByIdAndUpdate(
      reviewFields.revieweeId,
      avgRatingFields,
      {
        new: true,
        runValidators: true,
      }
    ).exec();

    return res.json(review);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: "Internal server error",
      message: err.message,
    });
  }
};

// Removes a review, given an id. Only the reviewer can remove their review.
// Also updates avg rating for the reviewee.
const remove = async (req, res) => {
  try {
    const reviewer = await ReviewModel.findOne(
      { _id: req.params.id },
      "reviewerId"
    ).exec();
    if (!reviewer || reviewer.reviewerId.toString() !== req.user.id) {
      return res.status(403).json({
        error: "Forbidden",
        message: "You do not have permission to access this path",
      });
    }

    let review = await ReviewModel.findById(req.params.id).exec();
    const oldRating = review.rating;
    const reviewed = await UserModel.findById(review.revieweeId).exec();
    const avgRatingFields = calculateAverageRemove(
      review.revieweeType,
      reviewed,
      oldRating
    );
    const avgRating = await UserModel.findByIdAndUpdate(
      review.revieweeId,
      avgRatingFields,
      {
        new: true,
        runValidators: true,
      }
    ).exec();

    await ReviewModel.findByIdAndRemove(req.params.id).exec();
    return res
      .status(200)
      .json({ message: `Review with id ${req.params.id} was deleted` });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: "Internal server error",
      message: err.message,
    });
  }
};

// Updates a review. Only rating, description and tags can be changed.
// Only owner of the review can use this function. Auth is done.
// Also updates avg rating for the reviewee.

const update = async (req, res) => {
  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({
      error: "Bad Request",
      message: "The request body is empty",
    });
  }

  const reviewFields = {};
  const { rating, description, tags } = req.body;
  if (rating) reviewFields.rating = rating;
  if (description) reviewFields.description = description;
  if (tags) {
    reviewFields.tags = tags.split(",").map((tag) => tag.trim());
  }
  try {
    const reviewer = await ReviewModel.findOne(
      { _id: req.params.id },
      "reviewerId"
    ).exec();
    if (!reviewer || reviewer.reviewerId.toString() !== req.user.id) {
      return res.status(403).json({
        error: "Forbidden",
        message: "You do not have permission to access this path",
      });
    }
    const oldRating = await ReviewModel.findById(
      req.params.id,
      "rating"
    ).exec();
    let review = await ReviewModel.findByIdAndUpdate(
      req.params.id,
      reviewFields,
      {
        new: true,
        runValidators: true,
      }
    ).exec();

    const reviewed = await UserModel.findById(review.revieweeId).exec();
    const avgRatingFields = calculateAverageUpdate(
      review.revieweeType,
      reviewed,
      review.rating,
      oldRating.rating
    );
    const avgRating = await UserModel.findByIdAndUpdate(
      review.revieweeId,
      avgRatingFields,
      {
        new: true,
        runValidators: true,
      }
    ).exec();

    return res.status(200).json(review);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: "Internal server error",
      message: err.message,
    });
  }
};

// Creates new results for reviewed user's average.
function calculateAverageCreate(revieweeType, reviewed, rating) {
  avgRatingFields = {};
  rating = parseFloat(rating);
  if (revieweeType == enums.InteractionType.EXECUTER) {
    if (!reviewed.executerRating || reviewed.executerRating === 0) {
      avgRatingFields.executerRating = rating;
      avgRatingFields.executerRatingCount = 1;
    } else {
      const totalRating =
        reviewed.executerRating * reviewed.executerRatingCount;
      const newTotal = totalRating + rating;
      const newCount = reviewed.executerRatingCount + 1;
      avgRatingFields.executerRating = (newTotal / newCount).toFixed(2);
      avgRatingFields.executerRatingCount = newCount;
    }
  } else {
    if (!reviewed.requesterRating || reviewed.requesterRating === 0) {
      avgRatingFields.requesterRating = rating;
      avgRatingFields.requesterRatingCount = 1;
    } else {
      const totalRating =
        reviewed.requesterRating * reviewed.requesterRatingCount;
      const newTotal = totalRating + rating;
      const newCount = reviewed.requesterRatingCount + 1;
      avgRatingFields.requesterRating = (newTotal / newCount).toFixed(2);
      avgRatingFields.requesterRatingCount = newCount;
    }
  }
  return avgRatingFields;
}

// Creates new results for reviewed user's average.
function calculateAverageUpdate(revieweeType, reviewed, rating, oldRating) {
  avgRatingFields = {};
  rating = parseFloat(rating);
  const ratingDiff = rating - oldRating;
  if (revieweeType == enums.InteractionType.EXECUTER) {
    const totalRating = reviewed.executerRating * reviewed.executerRatingCount;
    const newTotal = totalRating + ratingDiff;
    avgRatingFields.executerRating = (
      newTotal / reviewed.executerRatingCount
    ).toFixed(2);
  } else {
    const totalRating =
      reviewed.requesterRating * reviewed.requesterRatingCount;
    const newTotal = totalRating + ratingDiff;
    avgRatingFields.requesterRating = (
      newTotal / reviewed.requesterRatingCount
    ).toFixed(2);
  }
  return avgRatingFields;
}

// Creates new results for reviewed user's average.
function calculateAverageRemove(revieweeType, reviewed, oldRating) {
  avgRatingFields = {};
  rating = parseFloat(oldRating);

  if (revieweeType == enums.InteractionType.EXECUTER) {
    const totalRating = reviewed.executerRating * reviewed.executerRatingCount;
    const newTotal = totalRating - oldRating;
    avgRatingFields.executerRating = (
      newTotal /
      (reviewed.executerRatingCount - 1)
    ).toFixed(2);
    avgRatingFields.executerRatingCount = reviewed.executerRatingCount - 1;
  } else {
    const totalRating =
      reviewed.requesterRating * reviewed.requesterRatingCount;
    const newTotal = totalRating - oldRating;
    avgRatingFields.requesterRating = (
      newTotal /
      (reviewed.requesterRatingCount - 1)
    ).toFixed(2);
    avgRatingFields.requesterRatingCount = reviewed.requesterRatingCount - 1;
  }
  return avgRatingFields;
}
const listUserReviews = async (req, res) => {
  try {
    let reviewsAsRequester = await ReviewModel.find({
      revieweeId: req.params.id,
      revieweeType: enums.InteractionType.REQUESTER,
    }).exec();
    let reviewsAsExecuter = await ReviewModel.find({
      revieweeId: req.params.id,
      revieweeType: enums.InteractionType.EXECUTER,
    }).exec();
    return res
      .status(200)
      .json({
        reviewsAsRequester: reviewsAsRequester,
        reviewsAsExecuter: reviewsAsExecuter,
      });
  } catch (err) {
    return res.status(500).json({
      error: "Internal server error",
      message: err.message,
    });
  }
};

module.exports = {
  list,
  read,
  create,
  remove,
  update,
  getReviewOnOffer,
  listUserReviews
};
