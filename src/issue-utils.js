var plural = require('pluralize');

function issueToLabels(issue) {
  return issue.labels.map(function (label) {
    return label.name;
  }).join(',');
}

function issueToText(issue) {
  return '# ' + issue.number + ' ' + issueToLabels(issue) + ': ' + issue.title;
}

function issuesToText(issues) {
  return plural('issue', issues.length, true) + '\n' +
    issues.map(issueToText).join('\n');
}

module.exports = {
  issueToText: issueToText,
  issuesToText: issuesToText
};
