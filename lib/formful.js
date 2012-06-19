var formful = exports,
    fs      = require('fs');

formful.router = require('../lib/formful/router');
formful.view   = require('../lib/formful/view');

//
// Remark: Sugar syntax for mapping view commands to `formful` object
//
for (var fn in formful.view) {
  exports[fn] = formful.view[fn];
}

//
// Remark: Sugar syntax for `createRouter` and `extendRouter`
//
formful.createRouter = formful.router.createRouter;

formful.extendRouter = formful.router.extendRouter;

//
// Name this `broadway` plugin.
//
formful.name = 'formful';

//
// ### function init ()
// Initializes the `formful` plugin with the App.
//
formful.init = function (done) {
  var app = this;

  if (app.resources) {
    Object.keys(app.resources).forEach(function (resource) {
      //
      // Only exposes resources as formful if they have set:
      //
      //     Resource.formful = true;
      //
      //     Resource.formful = { param: ':custom' };
      //
      if (app.resources[resource].formful) {
        formful.extendRouter(
          app.router,
          app.resources[resource],
          app.resources[resource].formful
        );
      }
    });
  }
  done();
};

formful.createServer = function (resources, handler) {

  //
  // Remark: `director` and `restful` modules are only required for server creation
  //
  var director = require('director'),
      http     = require('http'),
      restful  = require('restful');

  var router = new director.http.Router();
  var formfulRouter = formful.createRouter(resources);
  var restfulRouter = restful.createRouter(resources);

  //
  // Override the default restful response handlers,
  // to use the formfulRouter instead
  //

  restful.extendRouter(router, resources, {}, function (req, res, status, key, value) {

    //
    // For now, assume this means validation error
    //
    if (status === 422 && key) {
      req.errors = key;
    }


    formfulRouter.dispatch(req, res, function (err) {
      if (err) {

        if (res.statusCode === 201) {
          console.log('fudriukers')

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
    req.on('end', function() {
      router.dispatch(req, res, function (err) {
        if (err) {
          formfulRouter.dispatch(req, res, function (err) {
            res.writeHead(404);
            res.end();
          })
        }
      });
    });
  });

  return server;

};