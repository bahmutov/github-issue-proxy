var gh = require('./github-api');
var Promise = require('bluebird');
var moment = require('moment');

var repoIssues = Promise.promisify(gh.issues.repoIssues);

function ghKey(options) {
  return options.user + '/' + options.repo;
}

function fetchIssues(options) {
  var key = ghKey(options);
  var now = moment();

  return repoIssues(options)
    .tap(function (issues) {
      console.log('fetched %s at %s', key, now);
    });
}

module.exports = fetchIssues;
