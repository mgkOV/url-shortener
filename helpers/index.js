const moment = require('moment');
const Link = require('../db').Link;
const isURL = require('validator').isURL;

var findShortLink = (req, res, next) => {
  Link.findOne({'shortLink': req.params.link})
    .then((link) => {
      if (link) {
        res.redirect(`http://${link.url}`)
      } else {
        next();
      }
    });
}

var validateLink = (req, res, next) => {
  var valid = isURL(req.params.link);
  if (valid) {
    next();
  } else {
    res.send('You provide bad-formated URL as a parameter');
  }
};

var shortenLink = (req, res, next) => {
  req.shortLink = Math.random().toString(10).slice(-4);
  // Check if short link exist in db
  Link.findOne({'shortLink': req.shortLink})
    .then((link) => {
      console.log('One');
      if (link) {
        shortenLink(req, res, next)
      } else {
        next();
      }
    });
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
