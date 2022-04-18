var express = require('express');
const { transferFundsGetFees, transferFundsRequest, transferFundsVerify, finishAdvert, playTokensRequest } = require('../service/api');
var router = express.Router();
const { VIDEOS } = require('../util/VIDEOS');

router.get('/request', (req, res, next) => {
    console.log(req.headers);
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

router.post('/end', async (req, res, next) => {
    // send finish advert request
    // if fail check 2 more times (possible solution but request times could make this innacurate)
    // add 1-2 secs after time to account for delay etc.
    var { userID: user_id,
            previousTime: previous_time,
            elapsedTime: elapsed_time,
            videoID: video_id
    } = req.body;
    var current_time = new Date().getTime();
    var video_duration = VIDEOS[video_id].duration;

    // successfully watched whole ad
    // if either elapsed time (video has been stopped and started)
    // or watched whole thing at once
    if( (current_time - previous_time + 50) > video_duration || (elapsed_time + 50) >= video_duration ){
        var payment_amount = VIDEOS[video_id].amount;
        try {
            var pending_payment_id = await transferFundsRequest(process.env.play_token, 'player_id', payment_amount, "cm_pub_dtx1a97srmh2uwe6");
            await transferFundsVerify(process.env.play_token, pending_payment_id);
            res.send("DONE");
        } catch(err) {
            console.log(err);
            res.send("ERROR");
        }
    } else {
        console.log("cheated");
        res.send("CHEAT");
    }
});

module.exports = router;