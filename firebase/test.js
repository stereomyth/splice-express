const feed = require(__dirname + '/../things/feed');
const admin = require('firebase-admin');

var serviceAccount = require(__dirname + '/key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

var db = admin.firestore();

let insert = data => {
  // let batch = db.batch();

  data.feed.cinemas.cinema.forEach(cinema => {
    let out = {
      id: cinema.id,
      name: cinema.name.replace('Cineworld ', ''),
      slug: cinema.url.replace('http://www1.cineworld.co.uk/cinemas/', ''),
      postcode: cinema.postcode,
    };

    db
      .collection('locations')
      .doc(out.slug)
      .set(out);
  });

  // let cinema = locations[0];
  // // console.log('cinema: ', cinema);

  // db
  //   .collection('locations')
  //   .doc('t1')
  //   .set(cinema);

  // console.log(locations);

  // return batch.commit();
};

feed
  .get('weekly_film_times')
  .then(feed.read)
  .then(insert)
  .then(() => {
    console.log('done');
  })
  .catch(err => {
    console.log(err);
  });
