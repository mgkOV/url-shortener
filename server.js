const express = require('express'),
      app = express();

const h = require('./helpers');
const port = process.env.PORT || 3000

app.set('view engine', 'ejs');
app.use(express.static('public'));

app
  .use('/:link*', h.findShortLink
               , h.validateLink
               , h.shortenLink)
  .get('/', (req, res) => {
    res.render('index');
  })
  .get('/:link*', (req, res) => {
    var linkObj = {
      original_url: req.orgURL,
      short_url: req.shortLink
    }
    res.json(linkObj);
  }).listen(port, () => console.log('App running on port', port));
