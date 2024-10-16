const mongoose = require('mongoose');

const StarPaymentHistorySchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    boostItem: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
    purchaseDate: { type: Date, default: Date.now },
    quantity: { type: Number, default: 1 },
    telegramPaymentChargeId: { type: String, default: '' },
    providerPaymentChargeId: { type: String, default: '' },
    payment: { type: String, default: '' },
});

module.exports = mongoose.model('StarPaymentHistory', StarPaymentHistorySchema);