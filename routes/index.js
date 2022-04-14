var express = require('express');
const { getAdvert } = require('../service/api');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/video', async function(req, res, next) {
  var data = await getAdvert('cm_pub_etvxuw901wq8h8rg');
  res.render('video', { url: data.url, id: data.video_id });
});

module.exports = router;
