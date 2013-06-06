/**
 * Module dependencies.
 */
var log           = require('debug')('notify'),
    EmailProvider = require('./provider.email');


var Provider = {

  getInstance: function(providerName, options) {

    if(providerName === 'email') {

      return new EmailProvider(options);

    // } else if(providerName === 'socketio') {

    } else {
      log('ERROR: %j provider does not exist.', providerName);
      return false;
    }
  }

};



module.exports = Provider;
