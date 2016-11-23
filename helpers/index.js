const moment = require('moment');
const Link = require('../db').Link;
const isURL = require('validator').isURL;

// Save link in db
var saveLink = (req, res, next) => {
  var link = new Link({
    url: req.orgURL,
    shortLink: req.shortLink,
    date: moment().format("MMMM DD YYYY, HH:mm (Z)")
  });

  link.save()
    .catch((error) => {
      console.log(error);
    });
  next();
};

//Chek if short link exist in db
var findShortLink = (req, res, next) => {
  Link.findOne({'shortLink': req.params.link})
    .then((link) => {
      if (link) {
        res.redirect(link.url);
      } else {
        next();
      }
    });
}

// Validate if link correct formated
var validateLink = (req, res, next) => {
  var valid = isURL(req.originalUrl.slice(1), {
    require_protocol: true
  });
  if (valid) {
    req.orgURL = req.originalUrl.slice(1);
    next();
  } else {
    res.send('You provided bad-formated URL as a parameter');
  }
};

//Create short link alias
var shortenLink = (req, res, next) => {
  //Check if URL exists in db
  Link.findOne({'url': req.orgURL})
    .then((link) => {
      if (link) {
        req.shortLink = link.shortLink;
        next();
      } else {
        req.shortLink = Math.random().toString(10).slice(-4);
        // Check if short link exists in db
        Link.findOne({'shortLink': req.shortLink})
          .then((link) => {
            if (link) {
              shortenLink(req, res, next)
            } else {
              saveLink(req, res, next);
            }
          });
      }
    });
};


module.exports = {
  findShortLink,
  validateLink,
  shortenLink
};
