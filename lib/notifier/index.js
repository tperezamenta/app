/**
 * Module dependencies.
 */

var Agenda = require('agenda');
var config = require('lib/config');
var log = require('debug')('democracyos:notifier');

var agenda = new Agenda( {db: { address: config('mongoUrl') }} );

agenda.define('law commented', function(job) {
  var data = JSON.parse(job.attrs.data);

  // var law = data.law;
  log('law commentd with comment whose id is: %j', data);
});

agenda.start();

exports.notify = function notify(event, data) {
  log('about to notify a law comment with data: %j', data);
  agenda.now(event, JSON.stringify(data));
}