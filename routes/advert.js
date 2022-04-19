const express = require('express');
const Payment = require('../models/payment');
const { transferFundsRequest, transferFundsVerify } = require('../service/api');
const router = express.Router();
const { VIDEOS } = require('../util/VIDEOS');

router.get('/request', (req, res, next) => {
    let user_id = req.query.userID;
    // logic for getting video -> return: video id, amount
    // possible logic if same video as watched last time
    var index = Math.floor(Math.random() * Object.keys(VIDEOS).length);
    var video_ids = Object.keys(VIDEOS);

    return res.json({
        user_id,
        url: VIDEOS[video_ids[index]].url,
        amount: VIDEOS[video_ids[index]].amount,
        video_id: video_ids[index]
    });
});

router.post('/end', async (req, res) => {
    // send finish advert request
    // if fail check 2 more times (possible solution but request times could make this innacurate)
    // add 1-2 secs after time to account for delay etc.
    console.log(req.session.startTime);
    var { userID: user_id, videoID: video_id } = req.body;
    var current_time = new Date().getTime();
    var video_duration = VIDEOS[video_id].duration;

    // if token saved when video is sent storing current time
    // minus current time is greater or equal to  video length then its valid
    if( (current_time - req.session.startTime) >= video_duration ){
        var payment_amount = VIDEOS[video_id].amount;
        try {
            var pending_payment_id = await transferFundsRequest(process.env.play_token, 'player_id', payment_amount, user_id);
            await transferFundsVerify(process.env.play_token, pending_payment_id);
            var new_payment = new Payment({
                user_id,
                amount: payment_amount
            });
            await new_payment.save();
            return res.json({ success: true });
        } catch(err) {
            console.log(err);
            res.send({ success: false });
        }
    } else {
        console.log("cheated");
        res.send("CHEAT");
    }
});

module.exports = router;