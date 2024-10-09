// models/Transaction.js

const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  product_title: {
    type: String,
    required: true,
  },
  product_description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  date_of_sale: {
    type: Date,
    required: true,
  },
  sold: {
    type: Boolean,
    default: false,
  },
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
