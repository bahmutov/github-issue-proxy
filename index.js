var config = require('./src/config');

function hasValidOptions() {
  return config.get('user') &&
    config.get('repo');
}

if (!hasValidOptions) {
  console.log('use: --user <github username> --repo <user repo>');
  process.exit(-1);
}

var fetchIssues = require('./src/fetch-issues');
var issueUtils = require('./src/issue-utils');

fetchIssues({
  user: config.get('user'),
  repo: config.get('repo')
}).then(function (issues) {
  console.log(issueUtils.issuesToText(issues));
});
