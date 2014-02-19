/**
 * Module dependencies.
 */

var Agenda = require('agenda');
var config = require('lib/config');
var log = require('debug')('democracyos:notifier');
var mailer = require('lib/mailer').mandrillMailer;
var notifications = require('./notifications');

var agenda = new Agenda( {db: { address: config('mongoUrl') }} );

agenda.define('law commented', function(job) {
  var data = JSON.parse(job.attrs.data);

  // var law = data.law;
  log('law commentd with comment whose id is: %j', data);
  sendLawCommentedEmail(data);
});

agenda.start();

exports.notify = function notify(event, data) {
  log('about to notify a law comment with data: %j', data);
  agenda.now(event, JSON.stringify(data));
}

function sendLawCommentedEmail(data) {
  log('email validation token created %j', token);
  var subject = t(notifications['law commented']);
  
  var rawJade = fs.readFileSync(resolve(__dirname, './views/' + notifications['law commented'].temlpate));
  var template = jade.compile(rawJade);

  var htmlBody = template();

  mailer.send('sacha.lifszyc@gmail.com', subject, htmlBody, function (err) {
    if (err) return callback(err);
    log('email validation mail sent to %s', 'sacha.lifszyc@gmail.com');
    return callback(err, data); 
  });
}