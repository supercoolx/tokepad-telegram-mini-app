const mongoose = require('mongoose');

const TonPaymentHistorySchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    boostItem: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
    purchaseDate: { type: Date, default: Date.now },
    quantity: { type: Number, default: 1 }, // Number of boosts purchased
    hash: { type: String, required: true },
    from: { type: String, required: true },
    to: { type: String, required: true },
    amount: { type: Number, required: true },
});

module.exports = mongoose.model('TonPaymentHistory', TonPaymentHistorySchema);