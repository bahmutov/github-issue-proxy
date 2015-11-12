var nconf = require('nconf');


nconf.argv()
  .env()
  .defaults({
    debug: false
  });

var ghApi = require('github');
var pkg = require('./package.json');

var gh = new ghApi({
  version: '3.0.0',
  // optional
  debug: nconf.get('debug'),
  headers: {
    'user-agent': pkg.name
  }
});

var issueUtils = require('./src/issue-utils');

gh.issues.repoIssues({
  user: 'bahmutov',
  repo: 'test-pre-git'
}, function (err, issues) {
  if (err) { throw err; }
  console.log(issueUtils.issuesToText(issues));
});
