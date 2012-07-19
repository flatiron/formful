var formful = exports,
    viewful  = require('viewful'),
    fs      = require('fs');

//
// Name used for `broadway` plugin system
//
formful.name = 'formful';

formful.router = require('../lib/formful/router');

var view = new viewful.View();

//
// Remark: Synchronously load the view
//
view.load('./lib/formful/view/form');

//
// Remark: Sugar syntax for mapping view commands to `formful` object
//
exports.form = {};
for (var v in view) {
  exports.form[v] = view[v]
}

//
// Remark: Sugar syntax for `createRouter` and `extendRouter`
//
formful.createRouter = formful.router.createRouter;
formful.extendRouter = formful.router.extendRouter;


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

formful.createServer = function (resources, options, handler) {

  options         = options || {};
  options.explore = options.explore || false;
  //
  // Remark: `director` and `restful` modules are only required for server creation
  //
  var director = require('director'),
      http     = require('http'),
      restful  = require('restful');

  var router = new director.http.Router();

  var formfulRouter = formful.createRouter(resources, options);

  //
  // Override the default restful response handlers,
  // to use the formfulRouter instead
  //
  restful.extendRouter(router, resources, options, function (req, res, status, key, value) {
    //console.log('restful response', req.body, req.url, status, key, value);

    req.data  = value;
    
    if (status === 422 && key) {
      req.errors = key;
    }

    if (status === 500 && key) {
      req.errors = key;
    }

    formfulRouter.dispatch(req, res, function (err) {
      if (err) {
        if (res.statusCode === 201) {
          res.write(302);
          res.writeHead('Location', '/creatures');
        }
        res.end();
      }
      else {}
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
            if (err) {
              /*
              if (res.statusCode === 201) {
                res.write(302);
                res.writeHead('Location', '/creatures');
              }
              */
              res.end();
            }
          });
        }
      });
    });
  });

  return server;

};