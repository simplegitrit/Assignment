// const express = require("express");
// const router = express.Router();

// const{getAllProduct, getAllProductTesting} = require("../controllers/product");

// router.route("/").get(getAllProduct);
// router.route("/testing").get(getAllProductTesting);


// module.exports = router;




// routes/transactions.js

const express = require('express');
const Transaction = require('../models/Transaction');

const router = express.Router();

// API to list all transactions with search and pagination
router.get('/transactions', async (req, res) => {
  const { search = '', page = 1, per_page = 10, month } = req.query;

  try {
    const query = {};
    
    // Add month filter
    if (month) {
      const monthRegex = new RegExp(`-${month.padStart(2, '0')}-`, 'i');
      query.date_of_sale = { $regex: monthRegex };
    }

    // Add search filter
    if (search) {
      query.$or = [
        { product_title: new RegExp(search, 'i') },
        { product_description: new RegExp(search, 'i') },
        { price: isNaN(search) ? undefined : Number(search) },
      ];
    }

    // Fetch transactions with pagination
    const transactions = await Transaction.find(query)
      .skip((page - 1) * per_page)
      .limit(Number(per_page));

    // Count total records
    const total = await Transaction.countDocuments(query);

    res.status(200).json({
      transactions,
      total,
      page: Number(page),
      per_page: Number(per_page),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
