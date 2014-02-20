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
var apiLaw = require('lib/db-api').law;

var resolve = path.resolve;
var agenda = new Agenda( {db: { address: config('mongoUrl') }} );

var rawJade = fs.readFileSync(resolve(__dirname, './views/' + notifications['law commented'].template));
var template = jade.compile(rawJade);

agenda.define('law commented', function(job) {
  var comment = JSON.parse(job.attrs.data);
  var options = { populate: 'participants' };
  apiLaw.get(comment.reference, options, function (err, law) {
    sendLawCommentedEmail(comment, law);
  });
});

agenda.start();

exports.notify = function notify(event, data) {
  agenda.now(event, JSON.stringify(data));
}

function sendLawCommentedEmail(comment, law) {
  var subject = notifications['law commented'].subject;
  
  function notAuthor(participant) {
    return participant.email != comment.author.email;
  }

  law.participants.filter(notAuthor).forEach(function (p) {
    var htmlBody = template({
      participant: p,
      law: law,
      comment: comment
    });

    mailer.send(p, subject, htmlBody, function (err) {
      if (err) return log('Error produced sending email to %s: %s', p.email, err.message);
      
      log('Law commented email sent to %s', p.email);
    });
  });
}