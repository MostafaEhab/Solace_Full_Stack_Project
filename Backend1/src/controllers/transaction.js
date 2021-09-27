const TransactionModel = require("../models/transaction");
const paypal = require("@paypal/checkout-server-sdk");

require("dotenv").config();

const environment = new paypal.core.SandboxEnvironment(
  process.env.PAYPAL_CLIENT_ID,
  process.env.PAYPAL_SECRET
);
const payPalClient = new paypal.core.PayPalHttpClient(environment);

// 503 (Service Unavailable). Paypal is down maybe.
const cancel = (req, res) => res.status(503).send("Cancelled");

module.exports = {
  cancel,
  payPalClient,
};
