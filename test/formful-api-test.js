var assert = require('assert'),
    vows = require('vows'),
    resourceful = require('resourceful'),
    formful = require('../lib/formful');



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


vows.describe('formful-engines-test').addBatch({
  'When using `formful`': {
    'formful.create(Resource)': {
      topic: function () {
        var self = this;
        formful.create(Creature, function (err, result) {
          if (err) {
            return console.log(err);
          }
          self.callback(null, result);
        });
      },
      'should return an HTML `create` form': function (template) {
        assert.isString(template);
      }
    },
    /*
    'formful.show(Resource)': {
      topic: function () {
        var self = this;
        formful.show('bob', Creature, function (err, result) {
          if (err) {
            return console.log(err);
          }
          self.callback(null, result);
        });
      },
      'should return an HTML `show` form': function (template) {
        assert.isString(template);
      }
    },
    */
    'formful.update(Resource)': {
      topic: function () {
        var self = this;
        formful.update('bob', Creature, function (err, result) {
          if (err) {
            return console.log(err);
          }
          self.callback(null, result);
        });
      },
      'should return an HTML `update` form': function (template) {
        assert.isString(template);
      }
    },
    'formful.destroy(Resource)': {
      topic: function () {
        var self = this;
        formful.destroy('bob', Creature, function (err, result) {
          if (err) {
            return console.log(err);
          }
          self.callback(null, result);
        });
      },
      'should return an HTML `destroy` form': function (template) {
        assert.isString(template);
      }
    }
  }
}).export(module);

