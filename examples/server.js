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

var resourceful = require('resourceful');

var Creature = resourceful.define('creature', function () {
  this.string('diet');
//  this.bool('vertebrate');
//  this.array('belly');

  /*
  this.timestamps();
  
  //
  // Remark: All custom type validation is provided by `revalidator`
  // see: https://github.com/flatiron/revalidator

  //
  // A required email address
  //
  this.string('email',    { format: 'email', default: 'marak.squires@gmail.com', required: true });
  
  //
  // An optional homepage with a default value
  //
  this.string('homepage', { format: 'url', default: "http://monster.com" });

  //
  // An ip address
  //
  this.string('ip', { format: 'ip-address' });

  //
  // An date-time address
  //
  this.string('date-time', { format: 'date-time' });

  //
  // An ipv6 address
  //
  this.string('date', { format: 'date' });

  //
  // A color
  //
  this.string('color', { format: 'color' });

  */

  this.prototype.feed = function (food) {
    this.belly.push(food);
  };
});



var router = new director.http.Router();
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

