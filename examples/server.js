
var http        = require('http'),
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

var formfulRouter  = formful.createRouter(Creature);
var restfulRouter  = restful.createRouter(Creature)

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
  restfulRouter.dispatch(req, res, function (err) {
    if (err) {
      formfulRouter.dispatch(req, res, function (err) {
        res.writeHead(404);
        res.end();
      })
    }
  });
});

server.listen(8000);
