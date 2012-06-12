var http        = require('http'),
    vows        = require('vows'),
    assert      = require('assert'),
    APIeasy     = require('api-easy'),
    formful     = require('../lib/formful'),
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

var router = formful.createRouter(Creature);
var restfulRouter = restful.createRouter(Creature)

var server = http.createServer(function (req, res) {
  req.chunks = [];
  req.on('data', function (chunk) {
    req.chunks.push(chunk.toString());
  });
  router.dispatch(req, res, function (err) {
    if (err) {
      restfulRouter.dispatch(req, res, function (err) {
        res.writeHead(404);
        res.end();
      })
    }
  });
});
server.listen(8000);

var suite = APIeasy.describe('restful/formful-router-test');

//
// Remark: All restful routing testing is handled by 'restful' module test suite
//
suite.use('localhost', 8000)
  .setHeader('Content-Type', 'application/json')
  .followRedirect(false)
    .get('/')
      .expect(200)
    .get('/create')
      .expect(200)
    .next()
    .post('/creatures')
      .expect(201)
    .next()
    .get('/creatures/1')
      .expect(200)
    .next()
    .get('/create')
      .expect(200)
    .get('/creatures/1/destroy')
      .expect(200)
    .get('/creatures/1/edit')
      .expect(200)
    .next()
    .post('/creatures/1/update', { "name" : "Dragon" })
      .expect(204)
    .next()
    .get('/creatures/1')
      .expect(200)
      .expect("should have correct name", function (err, res, body) {
         var result = JSON.parse(body);
         assert.equal(result.creature.name, "Dragon");
      })
    .next()
    .put('/creatures/1', { "name" : "Unicorn" })
      .expect(204)
    .next()
    .get('/creatures/1')
      .expect(200)
      .expect("should have correct name", function (err, res, body) {
         var result = JSON.parse(body);
         assert.equal(result.creature.name, "Unicorn");
      })

.export(module);