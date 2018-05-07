const feed = require(__dirname + '/../things/feed');
const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
  feed
    .query('cinemas')
    .then(cinemas => {
      res.send(cinemas);
    })
    .catch(err => {
      console.log(err);
    });
});

module.exports = router;
