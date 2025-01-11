const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Razorpay = require('razorpay');
require('dotenv').config(); // Load environment variables from .env file

const app = express();
app.use(cors());
app.use(bodyParser.json());

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createOrder = async (req, res) => {
  const { amount } = req.body;

  if (!amount || isNaN(amount) || amount <= 0) {
    return res.status(400).json({ message: 'Invalid amount provided' });
  }

  const options = {
    amount: amount, // Convert to paise
    currency: 'INR',
    receipt: `receipt#${Math.floor(Math.random() * 100000)}`,
    payment_capture: 1,
  };

  try {
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error('Error creating order:', error.stack);
    res.status(500).json({ message: 'Error creating order', error });
  }
};

module.exports = { createOrder };