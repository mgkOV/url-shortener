if(process.env.NODE_ENV === 'production') {
  module.exports = {
    dbURI: process.env.MONGOLAB_URI
  }
} else {
  module.exports = require('./dev.json');
}
