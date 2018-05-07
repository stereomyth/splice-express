var feed = require(__dirname + '/../things/feed');

let doTimes = (times, films) => {
  let out = {};

  times.map(time => {
    // return time;
    let film = time.film;
    let cinema = time.cinema;

    out[cinema] = out[cinema] || {};
    out[cinema][film] = out[cinema][film] || { ...films[film], times: [] };
    out[cinema][film].times.push(time.date);
  });

  return out;
};

let convert = data => {
  let films = data.feed.films.film;
  let filmSort = {};

  films.forEach(film => {
    filmSort[film.id] = film;
  });

  let times = doTimes(data.feed.performances.screening, filmSort);

  return {
    attr: data.feed.attributes.attribute.map(attr => {
      return {
        title: attr.$t,
        slug: attr.code,
      };
    }),
    cinemas: data.feed.cinemas.cinema.map(cinema => {
      cinema.name = cinema.name.replace('Cineworld ', '');
      return cinema;
    }),
    films,
    times,
  };
};

feed
  .get('weekly_film_times')
  .then(feed.read)
  .then(convert)
  .then(data => {
    feed.save('attr', data.attr);
    feed.save('cine', data.cinemas);
    feed.save('film', data.films);
    feed.save('times', data.times);
  })
  .catch(err => {
    console.log(err);
  });
