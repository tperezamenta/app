/**
 * Module dependencies.
 */

var fs = require('fs');
var jade = require('jade');
var path = require('path');
var Agenda = require('agenda');
var config = require('lib/config');
var log = require('debug')('democracyos:notifier');
var mailer = require('lib/mailer').mandrillMailer;
var notifications = require('./notifications');

var resolve = path.resolve;
var agenda = new Agenda( {db: { address: config('mongoUrl') }} );

agenda.define('law commented', function(job) {
  var data = JSON.parse(job.attrs.data);

  sendLawCommentedEmail(data);
});

agenda.start();

exports.notify = function notify(event, data) {
  log('about to notify a law comment with data: %j', data);
  agenda.now(event, JSON.stringify(data));
}

function sendLawCommentedEmail(data) {
  var subject = notifications['law commented'].subject;
  log('email subject is %s', subject);
  
  var rawJade = fs.readFileSync(resolve(__dirname, './views/' + notifications['law commented'].template));
  var template = jade.compile(rawJade);
  var htmlBody = template();

  mailer.send({email: 'sacha.lifszyc@gmail.com', fullName: 'Sacha Lifszyc'}, subject, htmlBody, function (err) {
    if (err) return log('Error produced sending email to %s: %j', 'sacha.lifszyc@gmail.com', err);
    
    return log('Law commented email sent to %s', 'sacha.lifszyc@gmail.com');
  });
}