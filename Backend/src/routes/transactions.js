const express = require('express');
const router = express.Router();
const TransactionController = require('../controllers/transaction');

router.get('/cancel', TransactionController.cancel);

module.exports = router;