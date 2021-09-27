const OfferModel = require("../models/offer");
const { check, validationResult } = require("express-validator");
const { OfferState, OfferTag } = require("../models/enums");
const payPalClient = require("./transaction").payPalClient;
const paypal = require("@paypal/checkout-server-sdk");
const UserModel = require("../models/user");
const TransactionModel = require("../models/transaction");
const enums = require("../models/enums");

require("dotenv").config();

// Get all offers in the database. Not safe and used only during development.
// TODO: Remove before submission.
const list = async (req, res, next) => {
  if (Object.keys(req.query).length !== 0) {
    next();
    return;
  }
  try {
    let offers = await OfferModel.find({}).exec();
    return res.status(200).json(offers);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: "Internal server error",
      message: err.message,
    });
  }
};

// Get an offer by specifying offer id
const read = async (req, res) => {
  try {
    let offer = await OfferModel.findById(req.params.id).exec();

    if (!offer)
      return res.status(404).json({
        error: "Not Found",
        message: `Offer not found`,
      });

    return res.status(200).json(offer);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: "Internal Server Error",
      message: err.message,
    });
  }
};

// Create a new offer
const create = async (req, res) => {
  if (Object.keys(req.body).length === 0)
    return res.status(400).json({
      error: "Bad Request",
      message: "The request body is empty",
    });

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    title,
    description,
    price,
    currency,
    city,
    startDate,
    endDate,
    tags,
    //state,
    //startDate,
    appliedUserIds,
  } = req.body;
  //Build offer object
  const offerFields = {};

  //offerFields.requesterId = req.user.id;
  //TODO: change to user.id when auth is completed
  offerFields.requesterId = req.user.id;
  if (title) offerFields.title = title;
  if (description) offerFields.description = description;
  if (price) offerFields.price = price;
  if (currency) offerFields.currency = currency;
  if (city) offerFields.city = city;
  if (startDate) offerFields.startDate = startDate;
  if (endDate) offerFields.endDate = endDate;
  if (tags){
    offerFields.tags=[];
    for (tag of tags){
      offerFields.tags.push(tag.trim().toUpperCase());
    }
    let uniqTags = tags => [...new Set(tags)];
    offerFields.tags= uniqTags(offerFields.tags);
  }
  offerFields.state = "NEW";
  if (appliedUserIds) {
    offerFields.appliedUserIds = appliedUserIds
      .split(",")
      .map((appliedUserId) => appliedUserId.trim());
  }
  try {
    let offer = new OfferModel(offerFields);
    console.log(offerFields);
    await offer.save();
    return res.json(offer);
    console.log(offerFields.executerId);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: "Internal server error",
      message: err.message,
    });
  }
};

// Remove an offer by specifying offer id
const remove = async (req, res) => {
  try {
    // check that the requester is the only one able to delete the offer

    const requester = await OfferModel.findOne(
      { _id: req.params.id },
      { requesterId: 1, _id: 0 }
    );
    if (requester.requesterId.toString() !== req.user.id) {
      return res.status(403).json({
        error: "Forbidden",
        message: "You donnot have permission to access this path",
      });
    }

    await OfferModel.findByIdAndRemove(req.params.id).exec();
    return res
      .status(200)
      .json({ message: `Offer with id${req.params.id} was deleted` });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: "Internal server error",
      message: err.message,
    });
  }
};

// Update an offer by specifying offer id
const update = async (req, res) => {
  try {
    // check that the requester is the only one able to update the offer

    const requester = await OfferModel.findOne(
      { _id: req.params.id },
      { requesterId: 1, _id: 0 }
    );
    if (requester.requesterId.toString() !== req.user.id) {
      return res.status(403).json({
        error: "Forbidden",
        message: "You donnot have permission to access this path",
      });
    }
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({
        error: "Bad Request",
        message: "The request body is empty",
      });
    }
    let offer = await OfferModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).exec();

    return res.status(200).json(offer);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: "Internal server error",
      message: err.message,
    });
  }
};

//Apply for an offer by specifying offer id
const apply = async (req, res) => {
  try {
    // Make sure that the requester cannot apply to his own offer

    const requester = await OfferModel.findOne(
      { _id: req.params.id },
      { requesterId: 1, _id: 0 }
    );
    if (requester.requesterId.toString() == req.user.id) {
      return res.status(403).json({
        error: "Forbidden",
        message: "You donnot have permission to access this path",
      });
    }
    // users can apply only for new offers

    const offerState = await OfferModel.findOne(
      { _id: req.params.id },
      { state: 1, _id: 0 }
    );
    if (offerState.state.toString() !== "NEW") {
      return res.status(400).json({
        error: "Bad Request",
        message: "This offer has already been matched",
      });
    }
    // check if user applied before
    if (
      (await OfferModel.find({
        _id: req.params.id,
        appliedUserIds: { $in: [req.user.id] },
      }).count()) > 0
    ) {
      return res.status(400).json({
        error: "Bad Request",
        message: "You have already applied to this offer",
      });
    }
    // Add req.user to the list of appliedIDs

    await OfferModel.findByIdAndUpdate(
      req.params.id,
      { $push: { appliedUserIds: req.user.id } },
      { new: true, upsert: true }
    );

    return res.status(200).json("You have succssfully applied to this offer");
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: "Internal server error",
      message: err.message,
    });
  }
};

//Choose an executer from the list of applied users
const choose = async (req, res) => {
  try {
    // check that the requester is the only one able to choose applicants

    const requester = await OfferModel.findOne(
      { _id: req.params.id },
      { requesterId: 1, _id: 0 }
    );
    if (requester.requesterId.toString() !== req.user.id) {
      return res.status(403).json({
        error: "Forbidden",
        message: "You donnot have permission to access this path",
      });
    }
    // requesters can choose executers only for new offers

    const offerState = await OfferModel.findOne(
      { _id: req.params.id },
      { state: 1, _id: 0 }
    );
    if (offerState.state.toString() !== "NEW") {
      return res.status(400).json({
        error: "Bad Request",
        message: "This offer has already been matched",
      });
    }
    //check if executer is in the list of applied users or not

    if (
      (await OfferModel.find({
        _id: req.params.id,
        appliedUserIds: { $in: [req.body.executerId] },
      }).count()) === 0
    ) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Please select a valid executer",
      });
    }
    //select the executer from req.body
    await OfferModel.findByIdAndUpdate(req.params.id, {
      executerId: req.body.executerId,
    });
    //change status to matched
    await OfferModel.findByIdAndUpdate(req.params.id, {
      state: OfferState.MATCHED,
    });
    return res
      .status(200)
      .json("Congratulations, You have selected an executer to help you");
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: "Internal server error",
      message: err.message,
    });
  }
};

// Navigate to payment function
const pay = async (req, res) => {
  try {
    const offer = await OfferModel.findOne(
      { _id: req.params.id },
      {
        requesterId: 1,
        _id: 1,
        title: 1,
        price: 1,
        currency: 1,
        executerId: 1,
        state: 1,
      }
    );
    // check that the requester is the only one able to navigate to payment.
    if (offer.requesterId.toString() !== req.user.id) {
      return res.status(403).json({
        error: "Forbidden",
        message: "You donnot have permission to access this path",
      });
    }
    // you cannot pay unless the state is Matched
    if (offer.state.toString() !== "MATCHED") {
      return res.status(400).json({
        error: "Bad Request",
        message: "You have to select an executer first",
      });
    }

    const executer = await UserModel.findOne(
      { _id: offer.executerId },
      { paypalEmail: 1 }
    );

    const price = parseFloat(offer.price).toFixed(2);
    const fee = (price * 0.1).toFixed(2);

    const createPaymentRequest = {
      intent: "CAPTURE",
      application_context: {
        return_url:
          "http://localhost:5000/api/offers/pay-success/" + req.params.id,
        cancel_url: "http://localhost:5000/api/transactions/cancel",
        brand_name: "SOLACE",
        locale: "en-US",
        user_action: "PAY_NOW",
      },
      purchase_units: [
        {
          reference_id: offer._id.toString() + "fee",
          amount: {
            currency_code: offer.currency,
            value: fee,
          },
          description: "[Fee] " + offer.title,
        },
        {
          reference_id: offer._id.toString(),
          amount: {
            currency_code: offer.currency,
            value: price,
          },
          payee: { email_address: executer.paypalEmail },
          description: offer.title,
        },
      ],
    };

    console.log(createPaymentRequest);

    const request = new paypal.orders.OrdersCreateRequest();
    request.headers["prefer"] = "return=representation";
    request.requestBody(createPaymentRequest);
    const response = await payPalClient.execute(request);
    console.log(response);

    for (let i = 0; i < response.result.links.length; i++) {
      console.log(response.result.links[i]);
      if (response.result.links[i].rel === "approve") {
        res.status(200).send({ redirect: response.result.links[i].href });
      }
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: "Internal server error",
      message: err.message,
    });
  }
};

const paymentSucceeded = async (req, res) => {
  const offer = await OfferModel.findOne(
    { _id: req.params.id },
    {
      requesterId: 1,
      _id: 1,
      title: 1,
      price: 1,
      currency: 1,
      executerId: 1,
      state: 1,
    }
  );
  console.log('here');
  const executer = await UserModel.findOne(
    { _id: offer.executerId },
    { paypalEmail: 1 }
  );

  const price = parseFloat(parseFloat(offer.price).toFixed(2));
  const fee = parseFloat((price * 0.1).toFixed(2));

  // change status to PAID
  await OfferModel.findByIdAndUpdate(req.params.id, {
    state: OfferState.PAID,
  });

  const transaction = {};
  transaction.paymentId = req.query.token;
  transaction.offerId = offer._id;
  transaction.fromId = offer.requesterId;
  transaction.toId = offer.executerId;
  transaction.amount = price + fee;
  transaction.currency = offer.currency;
  transaction.state = enums.TransactionState.PENDING;
  transaction.paymentType = "PAYPAL";
  transaction.bankDetails = executer.paypalEmail;

  console.log(transaction);
  // Persist that payment has been authorized.
  await new TransactionModel(transaction).save();
  res.redirect("http://localhost:3000/offers/" + offer._id);
};

//requester confirm that the job was done
const complete = async (req, res) => {
  try {
    // check that the requester is the only one able to set to complete

    const requester = await OfferModel.findOne(
      { _id: req.params.id },
      { requesterId: 1, _id: 0 }
    );
    if (requester.requesterId.toString() !== req.user.id) {
      return res.status(403).json({
        error: "Forbidden",
        message: "You donnot have permission to access this path",
      });
    }
    // you cannot pay unless the state is PAID

    const offerState = await OfferModel.findOne(
      { _id: req.params.id },
      { state: 1, _id: 0 }
    );
    console.log(offerState);
    if (offerState.state.toString() !== "PAID") {
      return res.status(400).json({
        error: "Bad Request",
        message: "Please make sure you have completed the payment ",
      });
    }
    // change status to COMPLETED
    await OfferModel.findByIdAndUpdate(req.params.id, {
      state: OfferState.COMPLETED,
    });

    const pendingTransaction = await TransactionModel.findOne(
      { offerId: req.params.id, state: enums.TransactionState.PENDING },
      {
        _id: 0,
        offerId: 1,
        paymentId: 1,
        fromId: 1,
        toId: 1,
        amount: 1,
        currency: 1,
        paymentType: 1,
        bankDetails: 1,
      }
    );

    request = new paypal.orders.OrdersCaptureRequest(
      pendingTransaction.paymentId
    );
    request.requestBody({});
    // Call API with your client and get a response for your call
    let response = await payPalClient.execute(request);
    console.log(`Response: ${JSON.stringify(response)}`);
    // If call returns body in response, you can get the deserialized version from the result attribute of the response.
    console.log(`Capture: ${JSON.stringify(response.result)}`);

    const successTransaction = JSON.parse(JSON.stringify(pendingTransaction));
    successTransaction.state = enums.TransactionState.SUCCESS;
    console.log(successTransaction);
    await new TransactionModel(successTransaction).save();

    return res.status(200).json("Thank you for trusting Solace");
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: "Internal server error",
      message: err.message,
    });
  }
};

const cancelOffer = async (req, res) => {
  try {
    // check that the requester is the only one able to set to complete

    const requester = await OfferModel.findOne(
      { _id: req.params.id },
      { requesterId: 1, _id: 0 }
    );
    if (requester.requesterId.toString() !== req.user.id) {
      return res.status(403).json({
        error: "Forbidden",
        message: "You donnot have permission to access this path",
      });
    }
    // you cannot cancel a completed offer

    const offerState = await OfferModel.findOne(
      { _id: req.params.id },
      { state: 1, _id: 0 }
    );
    if (offerState.state.toString() === "COMPLETED") {
      return res.status(400).json({
        error: "Bad Request",
        message: "You cannot cancel a completed offer",
      });
    }
    // you cannot cancel already canceled offer
    if (offerState.state.toString() === "CANCELED") {
      return res.status(400).json({
        error: "Bad Request",
        message: "The offer has already been canceled",
      });
    }
    // canceling new and matched offers
    if (
      offerState.state.toString() === "NEW" ||
      offerState.state.toString() === "MATCHED"
    ) {
      await OfferModel.findByIdAndUpdate(req.params.id, {
        state: OfferState.CANCELED,
      });
      return res.status(200).json("This offer has been canceled");
    }
    // canceling paid offers , we use refund function which will be done later and change state to cancel
    if (offerState.state.toString() === "PAID") {
      await OfferModel.findByIdAndUpdate(req.params.id, {
        state: OfferState.CANCELED,
      });
      return res
        .status(200)
        .json(
          "This offer has been canceled and Money will be transfered to your bank account soon"
        );
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: "Internal server error",
      message: err.message,
    });
  }
};

const cancelApply = async (req, res) => {
  try {
    // Make sure that the requester cannot canncel executers applications

    const requester = await OfferModel.findOne(
      { _id: req.params.id },
      { requesterId: 1, _id: 0 }
    );
    if (requester.requesterId.toString() == req.user.id) {
      return res.status(403).json({
        error: "Forbidden",
        message: "You donnot have permission to access this path",
      });
    }

    //check if executer is select or not
    // if not selected
    const executer = await OfferModel.findOne(
      { _id: req.params.id },
      { executerId: 1, _id: 0 }
    );
    console.log(executer.executerId.toString() !== req.user.id);

    if (executer.executerId.toString() !== req.user.id) {
      await OfferModel.findByIdAndUpdate(req.params.id, {
        state: OfferState.CANCELED,
      });
      return res
        .status(200)
        .json("you have canceled your application to this offer");
    }

    // else part if executer has been selected already

    // you cannot cancel your application to a completed offer

    const offerState = await OfferModel.findOne(
      { _id: req.params.id },
      { state: 1, _id: 0 }
    );
    console.log(offerState.state.toString());
    if (offerState.state.toString() === "COMPLETED") {
      return res.status(400).json({
        error: "Bad Request",
        message: "You cannot cancel your application to a completed offer",
      });
    }
    // you cannot cancel your application to canceled offer, doesn't make a difference
    if (offerState.state.toString() === "CANCELED") {
      return res.status(400).json({
        error: "Bad Request",
        message: "The offer has already been canceled",
      });
    }
    // canceling your application to paid offers , reach Tech support so that they can arrange someone else for the requester
    if (offerState.state.toString() === "PAID") {
      return res.status(400).json({
        error: "Bad Request",
        message:
          "You cannot cancel your application to a paid offer, please reach out to customer support",
      });
    }
    // canceling your application to matched offers
    if (offerState.state.toString() === "MATCHED") {
      await OfferModel.findByIdAndUpdate(req.params.id, {
        state: OfferState.NEW,
      });
      // remove user from list of applied users
      await OfferModel.findByIdAndUpdate(req.params.id, {
        $pull: { appliedUserIds: req.user.id },
      });
      // remove user from executerid field
      await OfferModel.findByIdAndUpdate(req.params.id, {
        executerId: undefined,
      });

      return res
        .status(200)
        .json("Your application to this offer has been canceled");
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

// Get all offers given a city, sorted by creation time, newest first.

const filterAndSort = async (req, res, next) => {
  var { title, city, startDate, endDate, price, state, tags, sortBy } =
    req.query;

  sortingStrategy = {};
  tagsStrategy = {};
  stateStrategy = {};

  try {
    if (!title) {
      title = "";
    }
    if (!city) {
      city = "";
    }
    if (!startDate) {
      startDate = new Date(0, 0, 0);
    } else {
      try {
        startDate = new Date(startDate);
      } catch (err) {
        console.log(err);
        return res.status(400).json({
          error: "Bad Request",
          message: "Please enter a valid endDate.",
        });
      }
    }
    if (!endDate) {
      endDate = new Date(3000, 12, 31);
    } else {
      try {
        endDate = new Date(endDate);
      } catch (err) {
        console.log(err);
        return res.status(400).json({
          error: "Bad Request",
          message: "Please enter a valid endDate.",
        });
      }
    }
    if (!price) {
      price = 0;
    }
    if (!state) {
      state = [];
      stateStrategy = { $nin: state };
    } else {
      state = state.split(",").map((state) => state.trim().toUpperCase());
      for (const item of state){
        if (!(item in OfferState)) {
          return res.status(400).json({
            error: "Bad Request",
            message: "Please enter a valid state.",
          });
        }
      }
      stateStrategy = { $in: state };
    }
    if (!tags) {
      tags = [];
      tagsStrategy = { $nin: tags };
    } else {
      tags = tags.split(",").map((tag) => tag.trim().toUpperCase());
      tagsStrategy = { $all: tags };
    }
    if (!sortBy) {
      sortingStrategy = { createdAt: "desc" };
    } else {
      if (sortBy === "priceAsc") {
        sortingStrategy = { price: "asc" };
      } else if (sortBy === "priceDesc") {
        sortingStrategy = { price: "desc" };
      } else if (sortBy === "creationAsc") {
        sortingStrategy = { createdAt: "asc" };
      } else if (sortBy === "creationDesc") {
        sortingStrategy = { createdAt: "desc" };
      } else if (sortBy === "startDateAsc") {
        sortingStrategy = { startDate: "asc" };
      } else if (sortBy === "startDateDesc") {
        sortingStrategy = { startDate: "desc" };
      } else if (sortBy === "endDateAsc") {
        sortingStrategy = { endDate: "asc" };
      } else if (sortBy === "endDateDesc") {
        sortingStrategy = { endDate: "desc" };
      }
    }
    let offer = await OfferModel.find({
      title: { $regex: title, $options: "i" },
      city: { $regex: city, $options: "i" },
      startDate: { $gte: startDate },
      endDate: { $lte: endDate },
      price: { $gte: price },
      state: stateStrategy,
      tags: tagsStrategy,
    })
      .sort(sortingStrategy)
      .exec();
    if (!offer || offer.length == 0)
      return res.status(404).json({
        error: "Not Found",
        message: "Offer not found for your search. Please make another search.",
      });

    return res.status(200).json(offer);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: "Internal Server Error",
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
  apply,
  choose,
  pay,
  paymentSucceeded,
  complete,
  cancelOffer,
  cancelApply,
  filterAndSort,
};
