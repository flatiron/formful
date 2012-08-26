var formful     = require('../lib/formful'),
    resourceful = require('resourceful'),
    Creature    = resourceful.define('creature');

Creature.property('type', String, { default: "dragon" });
Creature.property('email', String, { format: "email" });
Creature.property('life', Number, { default: 10, min: 0, max: 20 });

formful.createServer([Creature]).listen(8000, function () {
  console.log(' > formful server started on port 8000');
});

