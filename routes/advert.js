var express = require('express');
var router = express.Router();
const { VIDEOS } = require('../util/VIDEOS');

router.get('/request', (req, res, next) => {
    let user_id = req.query.userID;
    // logic for getting video -> return: video id, amount
    // possible logic if same video as watched last time
    var index = Math.floor((Math.random() * URLS.length));
    var video_ids = Object.keys(VIDEOS);
    return res.json({
        user_id,
        url: VIDEOS[video_ids[index]].uri,
        amount: VIDEOS[video_ids[video_ids]].amount,
        video_id: video_ids[index]
    });
});

router.get('/start', (req, res, next) => {
    // send request saying video has started playing
    // (unique id) ??
    var current_time = req.query.currentTime;
    return res.json({ current_time });
});

router.post('/end', async (req, res, next) => {
    // send finish advert request
    // if fail check 2 more times (possible solution but request times could make this innacurate)
    // add 1-2 secs after time to account for delay etc.

    var { videoID: video_id, userID: user_id } = req.body;
    var current_time = new Date().getTime();
    var previous_time = req.body.previousTime;
    var video_duration = VIDEOS[video_id].duration;

    // successfully watched whole ad
    if( (current_time - previous_time + 2) > video_duration ){
        var payment_amount = VIDEOS[video_id].amount;
        var response = await cmGetFees(process.env.play_token, 'player_id', payment_amount, user_id);
        if(response.ok === true){

        }
    }
});

module.exports = router;