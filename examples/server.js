
var http        = require('http'),
    formful     = require('../lib/formful'),
    director    = require('director'),
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

var router = new director.http.Router();
formful.extendRouter(router, Creature);
restful.extendRouter(router, Creature);

var server = http.createServer(function (req, res) {
  req.chunks = [];
  req.on('data', function (chunk) {
    req.chunks.push(chunk.toString());
  });

  //
  // TODO: Nested routers here is not right, should just be formfulRouter
  //       Director.mount seems to not want to work :-(
  //       Will investigate and fix. 
  //
  router.dispatch(req, res, function (err) {
    if (err) {
      console.log(err);
    }
    res.writeHead(404);
    res.end();
  })
});

server.listen(8000);
