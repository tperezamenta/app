/**
 * Module dependencies.
 */
var mailer        = require('nodemailer'),
    log           = require('debug')('notify'),
    jade          = require('jade'),
    notifications = require('./notifications'),
    config = require('../../config/config.dev');


function EmailProvider(options) {
  this.options = options;
}


EmailProvider.prototype.send = function() {

  if(this.isValid() && config.mailer.enabled) {

    for(var i in this.options.destination) {

      var message = this.buildMessage(this.options.destination[i]);

      if(message) {
        var transport = mailer.createTransport("SMTP", config.mailer);

        transport.sendMail(message, function(error) {

          if(error) {
            log('ERROR: Email could not be sent. Message: ' + error.message);
            return;
          }

          log('Email sent to ' + message.to);

          transport.close();
        });

      }

    }
  }
};


EmailProvider.prototype.isValid = function() {
  return true; // FIXME
};


EmailProvider.prototype.buildMessage = function(destination) {

  var notification = notifications[this.options.event];

  if(notification === undefined) {
    log('ERROR: Event "%j" is not definded in notifications.json', this.options.event);
    return false;
  }

  if(notification.email === undefined) {
    log('ERROR: Email settings for "%j" are not definded in notifications.json', this.options.event);
    return false;
  }

  var templateName = notification.email.template !== undefined ? notification.email.template : this.options.event + '.jade';
  var path = __dirname + '/views/' + templateName;
  var emailTemplate = require('fs').readFileSync(path, 'utf8');

  var params = {
    user: destination,
    data: this.options.data
  };

  var renderedBody    = render(emailTemplate, params);
  var renderedSubject = render('div '+ notification.email.subject, params);

  return {
    from:    config.mailer.from,
    to:      destination.email,
    subject: renderedSubject.replace(/<(?:.|\n)*?>/gm, ''),
    text:    notification.email.text !== undefined ? notification.email.text : '',
    html:    renderedBody
  };

};


function render(string, params) {
  var jadeFn = jade.compile(string);
  return jadeFn(params);
}

module.exports = EmailProvider;
