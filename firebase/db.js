const admin = require('firebase-admin');

var serviceAccount = require(__dirname + '/key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin.firestore();
