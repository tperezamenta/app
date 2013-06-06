/**
 * Module dependencies.
 */
var Notify = require('./notify');

/**

  Usage Examples:

  var user = { id: 1, name: 'Alan Reid', email: 'mail@alanreid.com.ar' };
  var proposal = { id: 123 };

  Explicit way:
    notify({
      "providers": ["email"],
      "time":"now",
      "event":"comment",
      "destination": user
    });

  Declarative way:
    notify('comment').to(user).withData({ proposal: proposal }).now();
    notify('comment').to(user).by('email').now();
    notify('comment').to(user).by(['email', 'socketio']).now();
    notify('comment').to(user).at('00:42');
    notify('comment').to(user).at('42 * * * *');
    notify('comment').to(user).by('email').every({ hour: 14, minute: 30, dayOfWeek: 0});

  Tips:
    -To add more events, just add it to notifications.json and create a template under the views folder.
    -Use the withData() setter to inject variables to the template.
    -Jade variables also work in the subject.

*/

module.exports = function(event) {

  var notify = new Notify();

  return notify.notify(event);

};


