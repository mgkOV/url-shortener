const config = require('../config');
const Mongoose = require('mongoose').connect(config.dbURI);

Mongoose.Promise = global.Promise;

Mongoose.connection.on('error', error => {
    console.log('Mongoose connection error: ' + error);
});

const schemaLink = new Mongoose.Schema({
    url: String,
    shortLink: String,
    date: String
});

const Link = Mongoose.model('Link', schemaLink);

module.exports = {
  Link
};
