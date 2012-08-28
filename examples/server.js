var formful     = require('../lib/formful'),
    resourceful = require('resourceful'),
    Creature    = resourceful.define('creature');

Creature.property('awesome', Boolean, { default: false });
Creature.property('type', String, { default: "dragon", enum: ["Dragon", "Unicorn", "Pony"] });
Creature.property('email', String, { format: "email" });
Creature.property('life', Number, { default: 10, min: 0, max: 20 });

var Database = resourceful.define('database', function(){

 this.string('type', {
   description: "The type of the database",
   enum: ["couch", "mongo", "redis", "mysql"],
   required: true,
   message: "Database type should be valid"
 });

 this.number('port', {
   description: "The port your node app should listen on",
   default: 8080,
   minimum: 1,
   maximum: 65535,
   message: "Port should be valid",
   editable: false
 });

 this.string('host', {
   description: "The host your node app should listen on",
   format: "host-name",
   minLenght: 1,
   default: "localhost",
   editable: false
 });

 this.string('username', {
   description: "The username used to connect to the database",
   editable: false
 });

 this.string('password', {
   description: "The password used to connect to the database",
   default: "",
   format: "password",
   editable: false
 });

 //this.object('metadata', { private: true });

});


formful.createServer([Creature, Database]).listen(8000, function () {
  console.log(' > formful server started on port 8000');
});

