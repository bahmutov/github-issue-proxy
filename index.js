var fetchIssues = require('./src/fetch-issues');
var issueUtils = require('./src/issue-utils');

fetchIssues({
  user: 'bahmutov',
  repo: 'test-pre-git'
}).then(function (issues) {
  console.log(issueUtils.issuesToText(issues));
});
