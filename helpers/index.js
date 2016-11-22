const moment = require('moment');
const Link = require('../db').Link;

var findShortLink = (req, res, next) => {
  console.log('Finding short link');
  next();
}

var validateLink = (req, res, next) => {
  var valid = true;
  if (valid) {
    console.log('Validate:', req.params.link);
    next();
  } else {
    console.log('Not valid');
    res.send('Link not valid');
  }
};

var shortenLink = (req, res, next) => {
  const shortLink = Math.random().toString(10).slice(-4);
  req.shortLink = shortLink;
  // need to check existens of the same short link
  next();
};

var saveLink = (req, res, next) => {
  var link = new Link({
    url: req.params.link,
    shortLink: req.shortLink,
    date: moment().format("MMMM DD YYYY, HH:mm (Z)")
  });

  link.save()
  next();
};

module.exports = {
  findShortLink,
  validateLink,
  shortenLink,
  saveLink
};
