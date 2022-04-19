const express = require('express');
const router = express.Router();

const Payment = require('../models/payment');

router.get('/adverts/:user_id', async (req, res) => {
    var user_id = req.params.user_id;
    try {
        var payments = Payment.find({ user_id }).select('-_id');
        console.log(payments);
        return res.json({ success: true, payments });
    } catch(err) {
        console.log(err);
        return res.json({ success: false, message: "Database Error" });
    }
});

module.exports = router;