var helpers = exports,
assert = require('assert');

var formful = require('../../lib/formful');
var resourceful = require('resourceful');

//
// Create a new Creature resource using the Resourceful library
//
helpers.Creature = resourceful.define('creature', function () {
  //
  // Specify a storage engine
  //
  this.use('memory');

  //
  // Specify some properties with validation
  //
  this.string('type');
  this.string('description');

  //
  // Specify timestamp properties
  //
  this.timestamps();
});


//
// Create a new Creature resource using the Resourceful library
//
helpers.User = resourceful.define('user', function () {
  //
  // Specify a storage engine
  //
  this.use('memory');
  this.string('name');

  //
  // Specify some properties with validation
  //
  this.string('email', { format: 'email', required: true })

  //
  // Specify a Number type
  //
  this.number('age', { message: 'is not a valid age' });

  //
  // Specify timestamp properties
  //
  this.timestamps();
});

