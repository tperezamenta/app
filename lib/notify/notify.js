/**
 * Module dependencies.
 */
var log      = require('debug')('notify'),
    Provider = require('./provider'),
    schedule = require('node-schedule');


function Notify() {

  this.options = {
    providers: ['email'],
    time: 'now',
    data: {}
  };

}


Notify.prototype.notify = function(event) {

  if(typeof event === 'object') {

    this.options = event;
    this.send();

  } else {
    this.options.event = event;
  }

  return this;
};


Notify.prototype.to = function(destination) {

  if(typeof destination === 'string') {
    destination = [ destination ];
  }

  this.options.destination = destination;
  return this;
};


Notify.prototype.now = function() {
  this.options.time = 'now';
  this.send();
};


Notify.prototype.at = function(time) {

  if(time.split(':').length > 0) {

    var tmp = time.split(':');

    var date = new Date();
    date.setHours(tmp[0]);
    date.setMinutes(tmp[1]);

    this.options.time = date;

  } else {
    this.options.time = time;
  }

  this.schedule();
};


Notify.prototype.every = function(time) {
  this.options.time = time;
  this.schedule();
};


Notify.prototype.by = function(providers) {

  if(typeof providers === 'string') {
    providers = [ providers ];
  }

  this.options.providers = providers;

  return this;
};

Notify.prototype.withData = function(data) {
  this.options.data = data;
  return this;
};


Notify.prototype.send = function() {

  if(this.isValid()) {

    for(var i in this.options.providers) {

      var providerName = this.options.providers[i];
      var provider = Provider.getInstance(providerName, this.options);

      if(provider) {
        provider.send();
      }

    }

  }

};


Notify.prototype.schedule = function() {

  if(this.isValid()) {

    var that = this;
    var j = schedule.scheduleJob(this.options.time, function() {
      that.send();
    });

  }

};


Notify.prototype.isValid = function() {

  var opt = this.options;

  if(opt.event === undefined || opt.event.length === 0) {
    log('ERROR: No event defined: %j', this.options);
    return false;
  }

  if(opt.destination === undefined || opt.destination.length === 0) {
    log('ERROR: No destination defined: %j', this.options);
    return false;
  }

  if(opt.providers === undefined || opt.providers.length === 0) {
    log('ERROR: No providers defined: %j', this.options);
    return false;
  }

  for(var i in this.options.providers) {
    var provider = this.options.providers[i];

  }

  return true;
};


module.exports = Notify;
