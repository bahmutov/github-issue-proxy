var ghApi = require('github');
var pkg = require('../package.json');
var config = require('./config');

var gh = new ghApi({
  version: '3.0.0',
  // optional
  debug: config.get('debug'),
  headers: {
    'user-agent': pkg.name
  }
});

module.exports = gh;
