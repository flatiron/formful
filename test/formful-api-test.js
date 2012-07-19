var http        = require('http'),
    vows        = require('vows'),
    assert      = require('assert'),
    APIeasy     = require('api-easy'),
    fixtures    = require('./fixtures'),
    macros      = require('./macros'),
    formful     = require('../lib/formful');

formful.createServer([fixtures.Creature, fixtures.Album]).listen(8000, function () {
  console.log(' > formful server started on port 8000');
});

var suite = APIeasy.describe('restful/formful-api-test');

//
// Remark: All restful routing testing is handled by 'restful' module test suite
//
suite.use('localhost', 8000)
  .setHeader('Content-Type', 'application/json')
  .followRedirect(false)
  .next()
    macros.resourceTest('Creature', 'bob', suite)
  .next()
    macros.relationalTest(suite) 
.export(module);