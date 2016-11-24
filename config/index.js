if(process.env.NODE_ENV === 'production') {
  module.exports = {
    dbURI: process.env.MONGODB_URI
  }
  console.log('MONGODB_URI': process.env.MONGODB_URI);
} else {
  module.exports = require('./dev.json');
}
