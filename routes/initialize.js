const express = require('express');
const axios = require('axios');
const Transaction = require('../models/Transaction');

const router = express.Router();

// API to initialize database with seed data
router.get('/initialize', async (req, res) => {
  const url = 'https://s3.amazonaws.com/roxiler.com/product_transaction.json';

  try {
    // Fetch the data from third-party API
    const response = await axios.get(url);
    const transactions = response.data;

    // Clear existing records
    await Transaction.deleteMany({});

    // Insert new data
    const seedData = transactions.map(transaction => ({
      product_title: transaction.title,
      product_description: transaction.description,
      price: transaction.price,
      date_of_sale: new Date(transaction.dateOfSale),
      sold: transaction.sold || false,  // Assuming there's a field that indicates if sold
    }));

    await Transaction.insertMany(seedData);

    res.status(200).json({ message: 'Database initialized successfully with seed data.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

