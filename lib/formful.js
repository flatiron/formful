var formful = exports,
    viewful  = require('viewful'),
    path    = require('path'),
    fs      = require('fs');

//
// Name used for `broadway` plugin system
//
formful.name = 'formful';


var view = new viewful.View({path: './lib/formful/view', input: "html"});
//
// Remark: Synchronously load the view
//
view.load();

//
// Remark: Sugar syntax for mapping view commands to `formful` object
//
exports.form = {};
for (var v in view) {
  exports.form[v] = view[v]
}


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

  //
  // Override the default restful response handlers,
  // to use the formfulRouter instead
  //
  restful.extendRouter(router, resources, options, function (req, res, status, key, value) {

    if (status === 422 && key) {
      req.errors = key;
    }

    if (status === 500 && key) {
      req.errors = key;
    }

    //console.log(req.url, req.restful, key, value)
    //
    // Remark: `req.action` is set in the `restful` route handler
    //
    var output = view.form[req.restful.action].render({ data: value, resource: req.restful.resource });
    res.end(view.form[req.restful.action].present({ data: value, resource: req.restful.resource}));
  });

  var server = http.createServer(function (req, res) {
    req.chunks = [];
    req.on('data', function (chunk) {
      req.chunks.push(chunk.toString());
    });
    req.on('end', function() {
      router.dispatch(req, res, function (err) {
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
    });
  });
  // console.log(router.routes)
  return server;
};