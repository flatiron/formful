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

// TODO: this works, but should be a .render() call instead
console.log(formful.view.form.create.present(Creature));
