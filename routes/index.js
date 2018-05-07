const feed = require(__dirname + '/../things/feed');
const express = require('express');
const router = express.Router();

// router.get('/:name', function(req, res, next) {
//   feed
//     .query(req.params.name)
//     .then(data => res.send(data))
//     .catch(err => {
//       console.log(err);
//     });
// });

router.get('/locations', function(req, res, next) {
  feed
    .query('cinemas')
    .then(data => res.send(data))
    .catch(err => {
      console.log(err);
    });
});

// filter films by cinema
router.get('/films', function(req, res, next) {
  feed
    .query('film')
    .then(data => res.send(data))
    .catch(err => {
      console.log(err);
    });
});

router.get('/times/:cinema', function(req, res, next) {
  const cinema = req.params.cinema || false;
  if (cinema) {
    feed
      .query('times')
      .then(data => res.send(data[cinema]))
      .catch(err => {
        console.log(err);
      });
  } else {
    res.send({ type: 'error', message: 'cinema id required' });
  }
});

module.exports = router;
