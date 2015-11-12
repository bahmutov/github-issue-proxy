var nconf = require('nconf');

nconf.argv()
  .env()
  .defaults({
    debug: false,
    maxAge: 10,
    maxAgeUnits: 'minutes'
  });

module.exports = nconf;
