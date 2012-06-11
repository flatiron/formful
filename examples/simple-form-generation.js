var http        = require('http'),
    formful     = require('../lib/formful'),
    viewful     = require('viewful'),
    resourceful = require('resourceful'),
    restful     = require('restful');

//
// Create a new Creature resource using the Resourceful library
//
var Creature = resourceful.define('creature', function () {
  //
  // Specify a storage engine
  //
  this.use('memory');

  //
  // Specify some properties with validation
  //
  this.string('name');
  this.string('description');

});



formful.create(Creature, function (err, result) {
  
  if (err) {
    return console.log(err);
  }
  
  console.log(result);
  
});