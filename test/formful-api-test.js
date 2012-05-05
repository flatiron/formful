var vows = require('vows'),
    assert = require('assert'),
    APIeasy = require('api-easy'),
    formful = require('../lib/formful');



var resourceful = require('resourceful');
var http = require('http');
var restful = require('restful');


//
// 
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

  //
  // Specify timestamp properties
  //
  this.timestamps();
});

//
// Now that the `Creature` prototype is defined
// we can add custom logic to be available on all instances
//
Creature.prototype.feed = function (food) {
  this.belly.push(food);
};


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

var suite = APIeasy.describe('restful/restful-api-test');

//
// Remark: All restful routing testing is handled by 'restful' module and test suite
//

suite.use('localhost', 8000)
  .setHeader('Content-Type', 'application/json')
  .followRedirect(false)
    .get('/create')
      .expect(200)
    .next()
    .post('/Creature')
      .expect(201)
    .next()
    .get('/Creature/1')
      .expect(200)
    .next()
    .get('/create')
      .expect(200)
    .get('/Creature/1/destroy')
      .expect(200)
    .get('/Creature/1/edit')
      .expect(200)
    .next()
    .post('/Creature/1/update', { "name" : "Dragon" })
      .expect(204)
    .next()
    .get('/Creature/1')
      .expect(200)
      .expect("should have correct name", function (err, res, body) {
         var result = JSON.parse(body);
         assert.equal(result.name, "Dragon");
      })
    .next()
    .put('/Creature/1', { "name" : "Unicorn" })
      .expect(204)
    .next()
    .get('/Creature/1')
      .expect(200)
      .expect("should have correct name", function (err, res, body) {
         var result = JSON.parse(body);
         assert.equal(result.name, "Unicorn");
      })
  

.export(module);