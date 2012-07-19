/*
 * core-test.js: Tests for `formful` core api
 *
 * (C) 2012, Nodejitsu Inc.
 *
 */

var assert = require('assert'),
    vows = require('vows'),
    formful = require('../'),
    fixtures = require('./fixtures');

vows.describe('formful/core').addBatch({
  'When using `formful`': {
    'creating a new router with one resource': {
      topic: function () {
        var router = formful.createRouter(fixtures.Creature);
        this.callback(null, router);
      },
      'should return a routing map': function (err, router) {
        assert.isObject(router.routes);
      },
      'should contain the correct routes': function (err, router) {
        assert.isObject(router.routes.creatures);
      }
    }
  }
}).addBatch({
  'When using `formful`': {
    'creating a new router with multiple resources': {
      topic: function () {
        var router = formful.createRouter([fixtures.Creature, fixtures.User]);
        this.callback(null, router);
      },
      'should return a routing map': function (err, router) {
        assert.isObject(router.routes);
      },
      'should contain the correct routes': function (err, router) {
        assert.isObject(router.routes.creatures);
        assert.isObject(router.routes.users);
      }
    }
  }
}).export(module);