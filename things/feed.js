const fs = require('fs');
const parser = require('xml2json');

const db = `${__dirname}/../json/`;
const loc = `${__dirname}/../data/`;
const url = 'https://www.cineworld.co.uk/syndication/';

const debug = true;

const https = require('https');

module.exports = {
  get(filename) {
    return new Promise((resolve, reject) => {
      if (debug) {
        resolve(filename);
      } else {
        const file = fs.createWriteStream(`${loc}${filename}.xml`);

        https.get(`${url}${filename}.xml`, response => {
          response.pipe(file);

          response.on('end', function() {
            resolve(filename);
          });
        });
      }
    });
  },

  read(filename) {
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

  query(filename) {
    return new Promise((resolve, reject) => {
      fs.readFile(`${db}${filename}.json`, (err, data) => {
        if (err) {
          reject(err);
        }
        if (data) {
          resolve(JSON.parse(data));
        }
      });
    });
  },
};
