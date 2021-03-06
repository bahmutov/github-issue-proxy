var plural = require('pluralize');
var check = require('check-more-types');

function issueToLabels(issue) {
  return issue.labels.map(function (label) {
    return label.name;
  }).join(',');
}

function issueToText(issue) {
  var labels = issueToLabels(issue).trim();
  if (labels) {
    labels += ' - ';
  }
  return '# ' + issue.number + ' ' + labels + issue.title;
}

function issuesToText(issues) {
  return plural('issue', issues.length, true) + '\n' +
    issues.map(issueToText).join('\n');
}

module.exports = {
  issueToText: issueToText,
  issuesToText: issuesToText
};
