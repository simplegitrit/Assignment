

const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB (Replace with your MongoDB URI)
mongoose.connect('mongodb://localhost:27017/transactionsDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Define Transaction schema and model
const transactionSchema = new mongoose.Schema({
    product_title: String,
    product_description: String,
    price: Number,
    date_of_sale: String, // Store as 'YYYY-MM-DD'
});

const Transaction = mongoose.model('Transaction', transactionSchema);


// API to initialize database with seed data
app.get('/initialize', async (req, res) => {
    try {
        const url = "https://s3.amazonaws.com/roxiler.com/product_transaction.json";
        const response = await axios.get(url);
        const transactions = response.data;

        // Clear existing data and insert new data
        await Transaction.deleteMany({});
        await Transaction.insertMany(transactions.map((transaction) => ({
            product_title: transaction.title,
            product_description: transaction.description,
            price: transaction.price,
            date_of_sale: transaction.dateOfSale,
        })));

        res.status(200).json({ message: "Database initialized successfully with seed data" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



// API to list transactions with search and pagination
app.get('/transactions', async (req, res) => {
    const { search = '', page = 1, per_page = 10, month } = req.query;

    // Create query for search parameters
    const searchQuery = {
        $or: [
            { product_title: new RegExp(search, 'i') }, // Case-insensitive search
            { product_description: new RegExp(search, 'i') },
            { price: isNaN(search) ? undefined : Number(search) }, // Match price if the search is a number
        ].filter((condition) => condition.price !== undefined || condition.product_title || condition.product_description)
    };

    // Filter by month
    if (month) {
        const monthPattern = `-${month.padStart(2, '0')}-`; // Pad the month with zero if it's a single digit
        searchQuery.date_of_sale = new RegExp(monthPattern);
    }

    try {
        // Apply search, pagination, and month filter
        const total = await Transaction.countDocuments(searchQuery);
        const transactions = await Transaction.find(searchQuery)
            .skip((page - 1) * per_page)
            .limit(Number(per_page));

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


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});




// routes/initialize.js

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

