const feed = require(__dirname + '/../things/feed');
const admin = require('firebase-admin');

var serviceAccount = require(__dirname + '/key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

var db = admin.firestore();

let insert = data => {
  let batch = db.batch();

  data.feed.cinemas.cinema.forEach(cinema => {
    let slug = cinema.url.replace('http://www1.cineworld.co.uk/cinemas/', '');

    batch.set(db.collection('locations').doc(slug), {
      id: cinema.id,
      slug,
      name: cinema.name.replace('Cineworld ', ''),
      postcode: cinema.postcode || '',
    });
  });

  return batch.commit();
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
