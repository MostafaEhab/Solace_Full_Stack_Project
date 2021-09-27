const express = require("express");
const { check, validationResult } = require("express-validator");
const router = express.Router();
const OfferController = require("../controllers/offer");
const enums = require("../models/enums");
//const auth = require('../middleware/auth');
const passport = require("passport");
const checkObjectId = require("../middleware/checkObjectId");
const Validator = require("validator");
var moment = require("moment");

// @route   GET api/offers
// @desc    Get all offers in db
// @access  Public
router.get("/", OfferController.list, OfferController.filterAndSort);

// @route   GET api/offers/:id
// @desc    Get an offers by offer id
// @access  Public
router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  OfferController.read
);

// @route   POST api/offers
// @desc    Post a new offer // update an existing offer
// @access  Private
router.post(
  "/",
  [
    passport.authenticate("jwt", { session: false }),
    [
      check("title", "Title is required").not().isEmpty(),
      check("description", "Description is required").not().isEmpty(),
      check("price", "Price is not valid").isNumeric(),
      check("startDate", "please enter a valid Date").not().isDate(),
      check("endDate", "please enter a valid Date").not().isDate(),

      // check('state').isIn(enums.OfferState),
    ],
  ],
  OfferController.create
);

// @route   DELETE api/offers/:id
// @desc    Delete an offer by offer id
// @access  Private
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  OfferController.remove
);

// @route   PUT api/offers/:id
// @desc    Update an offer by offer id
// @access  Private
router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  OfferController.update
);

router.put(
  "/apply/:id",
  passport.authenticate("jwt", { session: false }),
  checkObjectId("id"),
  OfferController.apply
);

router.put(
  "/choose/:id",
  passport.authenticate("jwt", { session: false }),
  checkObjectId("id"),
  OfferController.choose
);

router.put(
  "/pay/:id",
  passport.authenticate("jwt", { session: false }),
  checkObjectId("id"),
  OfferController.pay
);

router.get(
  "/pay-success/:id",
  checkObjectId("id"),
  OfferController.paymentSucceeded
);

router.put(
  "/complete/:id",
  passport.authenticate("jwt", { session: false }),
  checkObjectId("id"),
  OfferController.complete
);

router.put(
  "/canceloffer/:id",
  passport.authenticate("jwt", { session: false }),
  checkObjectId("id"),
  OfferController.cancelOffer
);

router.put(
  "/cancelapply/:id",
  passport.authenticate("jwt", { session: false }),
  checkObjectId("id"),
  OfferController.cancelApply
);
module.exports = router;
