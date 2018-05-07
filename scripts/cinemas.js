var feed = require(__dirname + '/../things/feed');

let convert = data => {
  return data.cinemas.cinema.map(cinema => {
    cinema.name = cinema.name.replace('Cineworld ', '');
    delete cinema.root;

    return cinema;
  });
};

feed
  .get('cinemas')
  .then(feed.read)
  .then(convert)
  .then(cinemas => feed.save('cinemas', cinemas))
  .catch(err => {
    console.log(err);
  });
