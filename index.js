var fetchIssues = require('./src/fetch-issues');

function isCalled() {
  return module.parent;
}

if (isCalled()) {
  module.exports = fetchIssues;
  return;
}

var config = require('./src/config');

function hasValidOptions() {
  return config.get('user') &&
    config.get('repo');
}

if (!hasValidOptions()) {
  console.log('use: --user <github username> --repo <user repo>');
  process.exit(-1);
}

var issueUtils = require('./src/issue-utils');

function saveIssues(filename, content) {
  var fs = require('fs');
  fs.writeFileSync(filename, JSON.stringify(content, null, 2));
  console.log('saved issues to %s', filename);
}

fetchIssues({
  user: config.get('user'),
  repo: config.get('repo')
}).then(function (issues) {
  console.log(issueUtils.issuesToText(issues));
  saveIssues('./saved-issues.json', issues);
}).catch(console.error.bind(console));
