var feed = require(__dirname + '/../things/feed');

let convert = data => {
  data = data.feed;

  let raw = {
    screens: data.performances.screening,
    attrs: data.attributes.attribute,
    locations: data.cinemas.cinema,
    films: data.films.film,
  };

  let cinemas = raw.locations.map(cinema => {
    return {
      id: cinema.id,
      name: cinema.name.replace('Cineworld ', ''),
      slug: cinema.url.replace('http://www1.cineworld.co.uk/cinemas/', ''),
      postcode: cinema.postcode,
    };
  });

  let filmByID = raw.films.reduce((acc, film) => {
    acc[film.id] = acc[film.id] || film;
    return acc;
  }, {});

  let total = raw.screens.reduce((acc, screen) => {
    let cid = screen.cinema;
    let film = filmByID[screen.film];

    acc[cid] = acc[cid] || {};
    acc[cid][film.title] = acc[cid][film.title] || {
      id: [],
      title: film.title,
      runTime: film.runningTime,
      img: film.posterUrl,
      screens: {},
    };
    let id = acc[cid][film.title].id;
    if (!id.includes(film.id)) {
      id.push(film.id);
    }
    (acc[cid][film.title].screens[screen.attributes] =
      acc[cid][film.title].screens[screen.attributes] || []).push(screen.date);

    return acc;
  }, {});

  let normalTotal = {};

  for (const cid in total) {
    normalTotal[cid] = Object.keys(total[cid]).map(title => {
      return total[cid][title];
    });
  }

  // return {
  // attr: data.feed.attributes.attribute.map(attr => {
  //   return {
  //     title: attr.$t,
  //     slug: attr.code,
  //   };
  // }),

  return { cinemas, total: normalTotal, filmByID };
};

feed
  .get('weekly_film_times')
  .then(feed.read)
  .then(convert)
  .then(data => {
    // feed.save('attr', data.attr);
    feed.save('locations', data.cinemas);
    // feed.save('film', data.films);
    feed.save('times', data.total);
  })
  .catch(err => {
    console.log(err);
  });
