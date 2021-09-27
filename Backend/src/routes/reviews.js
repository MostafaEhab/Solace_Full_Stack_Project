const express = require("express");
const passport = require("passport");
const router = express.Router();
const checkObjectId = require("../middleware/checkObjectId");

const ReviewController = require("../controllers/review");

// @route   GET api/reviews
// @desc    Get all reviews in db where reviewee is the user.
// @access  Public
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  ReviewController.list
);

// @route   GET api/reviews/:id
// @desc    Get a review by review id
// @access  Public
router.get("/:id", ReviewController.read);

router.get(
  "/review-on-offer/:id",
  passport.authenticate("jwt", { session: false }),
  checkObjectId("id"),
  ReviewController.getReviewOnOffer
);

// @route   DELETE api/reviews/:id
// @desc    Delete an review by review id
// @access  Private
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  checkObjectId("id"),
  ReviewController.remove
);
// @route   PUT api/reviews/:id
// @desc    Update an review by review id
// @access  Private
router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  checkObjectId("id"),
  ReviewController.update
);

// @route   POST api/reviews
// @desc    Post a new review // update an existing review
// @access  Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  ReviewController.create
);

// @route   get api/reviews/user/:id
// @desc    get all reviews of a certain user 
// @access  Private


router.get(
  "/user/:id",
  passport.authenticate("jwt", { session: false }),
  ReviewController.listUserReviews
);


module.exports = router;
