var la = require('lazy-ass');
var check = require('check-more-types');
var config = require('./config');
var gh = require('./github-api');
var Promise = require('bluebird');
var moment = require('moment');
var db = new require('pouchdb')('local-issues-db');

var repoIssues = Promise.promisify(gh.issues.repoIssues);

function ghKey(options) {
  return options.user + '/' + options.repo;
}

function fetchAndSave(options, fetchedRecord) {
  var key = ghKey(options);
  console.log('fetching issues for %s', key);

  return repoIssues(options)
    .tap(function (issues) {
      console.log('fetched %s at %s', key, moment());
    })
    .tap(function save(issues) {
      var record = {
        timestamp: moment().toISOString(),
        issues: issues
      };
      var revision = fetchedRecord && fetchedRecord._rev;
      console.log('saving issues for key %s, revision? %s', key, revision);
      return Promise.resolve(
        db.put(record, key, revision)
      );
    })
    .tap(function () {
      console.log('saved fetched issues to DB %s', key);
    });
}

function isOlderThan(maxAllowedAge, timestamp) {
  la(timestamp, 'invalid timestamp', timestamp);
  la(moment.isDuration(maxAllowedAge), 'not a moment duration', maxAllowedAge);

  var now = moment();
  var then = moment.isMoment(timestamp) ? timestamp : moment(timestamp);

  var passed = moment.duration(now.diff(then));
  console.log('since previous fetch passed: %s', passed.humanize());
  console.log('our caching time limit: %s', maxAllowedAge.humanize());

  then = then.add(maxAllowedAge);
  return then.isBefore(now);
}

function isInvalidTimestamp(record) {
  return !record || !record.timestamp;
}

function loadedFromDB(record) {
  var ts = moment(record.timestamp);
  console.log('loaded record from %s from DB', ts);

  if (isInvalidTimestamp(record)) {
    console.log('record is missing timestamp');
    return Promise.reject(record);
  }
  var maxAllowedAge = moment.duration(
    config.get('maxAge'),
    config.get('maxAgeUnits')
  );
  if (isOlderThan(maxAllowedAge, ts)) {
    console.log('cached version %s is older than allowed %s at time %s',
      ts, maxAllowedAge.humanize(), moment());
    return Promise.reject(record);
  } else {
    console.log('cached timestamp %s is younger than %s',
      ts, maxAllowedAge.humanize());
  }
  la(check.array(record.issues), 'record is missing issues array', record);
  return record.issues;
}

function dbLoad(key) {
  return db.get(key)
    .catch(function (err) {
      console.log('could not load from db %s', key);
      console.log(err.stack);
      return Promise.reject(err);
    });
}

function fetchIssues(options) {
  var key = ghKey(options);
  console.log('loading from db for key %s', key);

  return dbLoad(key)
    .then(loadedFromDB)
    .catch(fetchAndSave.bind(null, options))
    .catch(console.error.bind(console));
}

module.exports = fetchIssues;
