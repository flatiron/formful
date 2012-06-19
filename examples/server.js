var formful     = require('../lib/formful')
var resourceful = require('resourceful');

var Creature = resourceful.define('creature', function () {

  this.string('diet', { required: true });

  //
  // A required email address
  //
  this.string('email',    { format: 'email', description: 'Enter email...', message: "Invalid email!", required: true });
  
  //
  // Assume an array of strings for now...
  //
  this.string('flavor', { enum: ['cherry', 'lemon', 'purple'] });

  /*
  this.timestamps();
  
  //
  // Remark: All custom type validation is provided by `revalidator`
  // see: https://github.com/flatiron/revalidator

  
  //
  // An optional homepage with a default value
  //
  this.string('homepage', { format: 'url', default: "http://monster.com" });

  //
  // An ip address
  //
  this.string('ip', { format: 'ip-address' });

  //
  // An date-time address
  //
  this.string('date-time', { format: 'date-time' });

  //
  // An ipv6 address
  //
  this.string('date', { format: 'date' });

  //
  // A color
  //
  this.string('color', { format: 'color' });

  */

});

formful.createServer(Creature).listen(8000, function () {
  console.log(' > formful server started on port 8000');
});