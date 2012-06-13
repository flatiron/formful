var http        = require('http'),
    formful     = require('../lib/formful'),
    director    = require('director'),
    resourceful = require('resourceful'),
    restful     = require('restful');


var router = new director.http.Router();

var Creature = resourceful.define('creature', function () {
  this.string('diet');
});

var formfulRouter = formful.createRouter(Creature);
var restfulRouter = restful.createRouter(Creature);

//
// Override the default restful response handlers,
// to use the formfulRouter instead
//

restful.extendRouter(router, Creature, {}, function (req, res, status, key, value) {
  formfulRouter.dispatch(req, res, function (err) {
    if (err) {
      if (res.statusCode === 201) {
        res.write(302);
        res.writeHead('Location', '/creatures');
      }
      res.end();
    }
  })
});

var server = http.createServer(function (req, res) {
  req.chunks = [];
  req.on('data', function (chunk) {
    req.chunks.push(chunk.toString());
  });
  router.dispatch(req, res, function (err) {
    if (err) {
      formfulRouter.dispatch(req, res, function (err) {
        res.writeHead(404);
        res.end();
      })
    }
  });
});
server.listen(8000);

console.log(' > formful server started on port 8000');