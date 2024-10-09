// routes/statistics.js

const express = require('express');
const Transaction = require('../models/Transaction');

const router = express.Router();

// API for statistics (sale amount, sold and unsold items)
router.get('/statistics', async (req, res) => {
  const { month } = req.query;

  if (!month) {
    return res.status(400).json({ error: 'Month is required.' });
  }

  try {
    // Create a regex to match the given month (MM)
    const monthRegex = new RegExp(`-${month.padStart(2, '0')}-`, 'i');

    // Total sale amount for sold items in the given month
    const totalSaleAmount = await Transaction.aggregate([
      { $match: { date_of_sale: { $regex: monthRegex }, sold: true } },
      { $group: { _id: null, totalAmount: { $sum: '$price' } } },
    ]);

    // Total number of sold items for the selected month
    const totalSoldItems = await Transaction.countDocuments({
      date_of_sale: { $regex: monthRegex },
      sold: true,
    });

    // Total number of unsold items for the selected month
    const totalUnsoldItems = await Transaction.countDocuments({
      date_of_sale: { $regex: monthRegex },
      sold: false,
    });

    res.status(200).json({
      totalSaleAmount: totalSaleAmount[0]?.totalAmount || 0,
      totalSoldItems,
      totalUnsoldItems,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
