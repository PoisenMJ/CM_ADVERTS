const mongoose = require('mongoose');

const paymentSchema = mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    from: {
        type: String,
        required: true,
        enum: ['advert', 'other'],
        default: 'advert'
    },
    amount: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    }
});

const Payment = mongoose.model('payment', paymentSchema);

module.exports = Payment;