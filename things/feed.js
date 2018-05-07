const fs = require('fs');
const parser = require('xml2json');

const db = `${__dirname}/../json/`;
const loc = `${__dirname}/../data/`;
// const loc = 'https://www.cineworld.co.uk/syndication/';

module.exports = {
  get(filename) {
    return new Promise((resolve, reject) => {
      fs.readFile(`${loc}${filename}.xml`, (err, data) => {
        if (err) {
          reject(err);
        }

        resolve(parser.toJson(data, { object: true, coerce: true }));
      });
    });
  },

  save(filename, data) {
    return new Promise((resolve, reject) => {
      const json = JSON.stringify(data);
      fs.writeFile(`${db}${filename}.json`, json, 'utf8', err => {
        if (err) {
          reject(err);
        }
        resolve();
      });
    });
  },
};
