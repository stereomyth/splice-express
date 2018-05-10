const feed = require(__dirname + '/../things/feed');
// const db = require(__dirname + '/db.js');

let insert = data => {
  // let batch = db.batch();
  const cinemas = data.feed.cinemas.cinema;
  const films = data.feed.films.film;
  const screens = data.feed.performances.screening;

  let filmByID = {};
  let cinemaByID = {};

  cinemas.forEach(cinema => {
    let slug = cinema.url.replace('http://www1.cineworld.co.uk/cinemas/', '');

    cinemaByID[cinema.id] = slug;
  });

  films.forEach(film => {
    let slug = film.url.replace('http://www1.cineworld.co.uk/films/', '');

    filmByID[film.id] = slug;

    // batch.set(db.collection('films').doc(slug), {
    //   slug,
    //   title: film.title,
    //   runTime: film.runningTime,
    //   img: film.posterUrl,
    // });
  });
  screens.forEach(screen => {
    console.log({
      location: cinemaByID[screen.cinema],
      date: screen.date,
      film: filmByID[screen.film],
    });
    // let slug = cinema.url.replace('http://www1.cineworld.co.uk/cinemas/', '');

    // cinemaByID[cinema.id] = slug;
  });

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
