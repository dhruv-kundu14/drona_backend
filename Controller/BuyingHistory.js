
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config(); // Load environment variables from .env file

const app = express();
app.use(cors());
app.use(bodyParser.json());

const { getDb } = require('../Config/mongo');
const { REACT_APP_IMG_URL } = process.env; // Add base URL from environment


// Save purchase history
const PostHistory = async (req, res) => {
  const { userId, items } = req.body;

  console.log(REACT_APP_IMG_URL, 'BASE_URL');

  if (!userId || !items || !Array.isArray(items)) {
    return res.status(400).json({ error: 'Invalid data provided.' });
  }

  try {
    // const db = await getDB(); // Get the MongoDB database connection
    const purchaseHistoryCollection =await getDb().collection('userHistory'); // Define the collection name

    const newHistory = {
      userId,
      items: items.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        purchaseDate: new Date(item.purchaseDate),
        image: `${REACT_APP_IMG_URL}${item.image}`, // Ensure full URL for image
      })),
    };

    await purchaseHistoryCollection.insertOne(newHistory); // Save the data into the collection
    res.status(201).json({ message: 'Purchase history saved successfully.' });
  } catch (error) {
    console.error('Error saving purchase history:', error);
    res.status(500).json({ error: 'Failed to save purchase history.' });
  }
};

// Get purchase history
const GetHistory = async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required.' });
  }

  try {
    const purchaseHistoryCollection = await getDb().collection('userHistory'); // Define the collection name

    const history = await purchaseHistoryCollection
      .find({ userId })
      .sort({ 'items.purchaseDate': -1 }) // Sort by most recent purchase date
      .toArray(); // Convert to an array

    res.status(200).json(history);
  } catch (error) {
    console.error('Error fetching purchase history:', error);
    res.status(500).json({ error: 'Failed to fetch purchase history.' });
  }
};

module.exports = { PostHistory, GetHistory };
