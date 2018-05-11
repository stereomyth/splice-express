const feed = require(__dirname + '/../things/feed');
// const db = require(__dirname + '/db.js');

let insert = data => {
  // let batch = db.batch();
  const cinemas = data.feed.cinemas.cinema;
  const films = data.feed.films.film;
  const screens = data.feed.performances.screening;

  let filmByID = {};
  let cinemaByID = {};

  // build and save locations
  cinemas.forEach(data => {
    const cinema = {
      slug: data.url.replace('http://www1.cineworld.co.uk/cinemas/', ''),
      name: data.name.replace('Cineworld ', ''),
      postcode: data.postcode || '',
    };

    cinemaByID[data.id] = cinema.slug;
    // batch.set(db.collection('locations').doc(cinema.slug), cinema);
  });

  // build and save films
  films.forEach(data => {
    const film = {
      slug: data.url.replace('http://www1.cineworld.co.uk/films/', ''),
      title: data.title,
      runTime: data.runningTime,
      img: data.posterUrl,
    };

    filmByID[data.id] = film.slug;
    // batch.set(db.collection('films').doc(film.slug), film);
  });

  let types = [];

  screens.forEach(data => {
    // const attr = data.attributes.split(',');
    const attr = data.attributes;

    const screen = {
      location: cinemaByID[data.cinema],
      date: data.date,
      film: filmByID[data.film],
      attr,
    };
    // if (attr.includes('IMAX')) {
    //   console.log(attr);
    // }

    if (!types.includes(attr)) {
      types.push(attr);
      // console.log(screen);
    }

    // 2d
    // imax
    // 3d
    // imax 3d
    // 4dx
    // 3d 4dx

    // batch.set(
    //   db
    //     .collection('locations')
    //     .doc(screen.location)
    //     .collection('screens')
    //     .doc(),
    //   screen
    // );
  });

  console.log('types: ', types);
  // console.log('filmByID: ', filmByID);
  // console.log('cinemaByID: ', cinemaByID);

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
