var express = require('express');
var router = express.Router();
const { URLS } = require('../util/VIDEOS');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/video', function(req, res, next) {
  var index = Math.floor((Math.random() * URLS.length));
  console.log(index);
  res.render('video', { url: URLS[index] });
})

module.exports = router;
