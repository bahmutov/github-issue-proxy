var nconf = require('nconf');

nconf.argv()
  .env()
  .defaults({
    debug: false
  });

module.exports = nconf;
