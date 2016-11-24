const moment = require('moment');
const Link = require('../db').Link;
const isURL = require('validator').isURL;
const _ = require('lodash');

var seeds = () => {
  Link.count({})
    .then(quantity => {
      if(quantity === 0) {
        let s = require('../db/seeds.json');
        _.each(s, seed => {
          seed.date = moment().format("DD-MM-YY");
          seed.shortLink = `https://mww-shorten-url.herokuapp.com/${seed.shortLink}`;
          let link = new Link(seed);
          link.save()
            .catch((error) => {
              console.log(error);
            });
        });
      }
    })
};

// Save link in db
var saveLink = (req, res, next) => {
  var link = new Link({
    url: req.orgURL,
    shortLink: `${req.shortLink}`,
    date: moment().format("DD-MM-YY")
  });

  link.save()
    .catch((error) => {
      console.log(error);
    });
  next();
};

//Chek if short link exist in db
var findShortLink = (req, res, next) => {
  var query = `https://mww-shorten-url.herokuapp.com/${req.params.link}`
  Link.findOne({'shortLink': query})
    .then((link) => {
      if (link) {
        res.redirect(link.url);
      } else {
        next();
      }
    });
};

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
        let token = Math.random().toString(10).slice(-4);
        req.shortLink = `https://mww-shorten-url.herokuapp.com/${token}`
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

var getLastLinks = (req, res, next) => {
  Link.find({}).sort({ _id: -1 }).limit(10)
    .then((links) => {
      req.links = links;
      next();
    })
    .catch((error) => {
      console.log(error);
      next();
    });
};

module.exports = {
  seeds,
  findShortLink,
  validateLink,
  shortenLink,
  getLastLinks
};
