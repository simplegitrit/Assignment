// server.js

const express = require('express');
const mongoose = require('mongoose');
const initializeRoutes = require('./routes/initialize');
const transactionRoutes = require('./routes/transactions');
const statisticsRoutes = require('./routes/statistics');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/transactionsDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Middleware to parse JSON
app.use(express.json());

// Routes
app.use(initializeRoutes);
app.use(transactionRoutes);
app.use(statisticsRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
