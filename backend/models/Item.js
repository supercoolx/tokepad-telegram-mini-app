const mongoose = require('mongoose');

// Define the Follow schema
const ItemSchema = new mongoose.Schema({
    boostid: { type: String, required: true, unique: true },
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    logo: { type: String, default: '' },
    type: { type: String, enum: ['one-time', 'many-time', 'forever', 'period'], required: true, default: 'period' },
    period: { type: Number, default: 1 }, // Only applicable for 'period' type, in days
    maxUses: { type: Number, default: 1 }, // Only applicable for 'many-time' type
    price: { type: Number, default: 2 },
    bonus: { type: Number, default: 2 }
});

module.exports = mongoose.model('Item', ItemSchema);