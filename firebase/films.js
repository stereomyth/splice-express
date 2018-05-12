const feed = require(__dirname + '/../things/feed');
const db = require(__dirname + '/db.js');

let insert = data => {
  let batch = db.batch();

  const raw = {
    cinemas: data.feed.cinemas.cinema,
    films: data.feed.films.film,
    screens: data.feed.performances.screening,
  };

  let filmByID = {};
  let cinemaByID = {};

  // build and save locations
  raw.cinemas.forEach(data => {
    const cinema = {
      slug: data.url.replace('http://www1.cineworld.co.uk/cinemas/', ''),
      name: data.name.replace('Cineworld ', ''),
      postcode: data.postcode || '',
    };

    cinemaByID[data.id] = cinema.slug;
    // batch.set(db.collection('locations').doc(cinema.slug), cinema);
  });

  // build and save films
  raw.films.forEach(data => {
    const film = {
      slug: data.url.replace('http://www1.cineworld.co.uk/films/', ''),
      title: data.title,
      runTime: data.runningTime,
      img: data.posterUrl,
    };

    filmByID[data.id] = film.slug;
    // batch.set(db.collection('films').doc(film.slug), film);
  });

  const out = raw.screens.reduce((acc, data) => {
    const cid = cinemaByID[data.cinema];
    const film = filmByID[data.film];

    const attr = data.attributes;
    let type = attr.includes('3D') ? '3D' : '2D';

    if (attr.includes('IMAX')) {
      type += '-IMAX';
    } else if (attr.includes('4DX')) {
      type += '-4DX';
    }

    acc[cid] = acc[cid] || {};
    acc[cid][film] = acc[cid][film] || {};
    acc[cid][film][type] = acc[cid][film][type] || [];

    acc[cid][film][type].push({
      date: data.date,
      attr: attr.split(','),
    });

    return acc;
  }, {});

  Object.keys(out).forEach(slug => {
    const cinema = out[slug];
    batch.set(
      db
        .collection('locations')
        .doc(slug)
        .collection('films')
        .doc(),
      cinema
    );
  });

  // console.log(out['birmingham-broad-street']);
  // console.log(Object.keys(out).length);
  // console.log(Object.keys(out['birmingham-broad-street']).length);

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
