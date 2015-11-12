var gh = require('./github-api');
var Promise = require('bluebird');

var repoIssues = Promise.promisify(gh.issues.repoIssues);

module.exports = repoIssues;
