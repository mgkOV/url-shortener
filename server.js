const express = require('express'),
      app = express();

const h = require('./helpers');
const port = process.env.PORT || 3000

app
  .use('/:link', h.findShortLink
               , h.validateLink
               , h.shortenLink
               , h.saveLink)
  .get('/', (req, res) => {
    res.send('Home page');
  })
  .get('/:link', (req, res) => {
    res.send(req.shortLink);
  }).listen(port, () => console.log('App running on port', port));
