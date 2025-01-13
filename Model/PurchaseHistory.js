// models/PurchaseHistory.js
const mongoose = require('mongoose');

const purchaseHistorySchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: [
    {
      id: { type: Number, required: true },
      name: { type: String, required: true },
      price: { type: String, required: true },
      quantity: { type: Number, required: true },
      purchaseDate: { type: Date, required: true },
      image: { type: String, required: true },
    },
  ],
});

const PurchaseHistory = mongoose.model('PurchaseHistory', purchaseHistorySchema);
module.exports = PurchaseHistory;
