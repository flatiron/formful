  var formful  = require('../formful'),
    resourceful = require('resourceful'),

    director = require('director'),
    utile    = require('utile'),
    util     = require('util');


//
// ### function FormfulRouter (resource, options)
// #### @resource {formful.Resource} Resource to use for the router.
// #### @options {Object} Options to use when attaching routes
//
// "FormfulRouter" Constructor function that will dispatch view urls
// for specified modifying the resource with HTML forms
//
// GET     /creatures           => view.show()
// GET     /creatures/1         => view.show(1)
// GET     /creatures/1/update  => view.update(1)
// GET     /creatures/1/destroy => view.destroy(1)

//
var FormfulRouter = exports.FormfulRouter = function (resource, options) {
  options = options || {};
  options.strict = options.strict || false;

  if(typeof options.explore === "undefined") {
    options.explore = true;
  }

  //
  // FormfulRouter inherits from director.http.Router
  //
  director.http.Router.call(this, options);

  this.resource = resource;

  exports.extendRouter(this, resource, options);
};

//
// Inherit from `director.http.Router`.
//
util.inherits(FormfulRouter, director.http.Router);

exports.createRouter = function (resource, options) {
  return new FormfulRouter(resource, options);
}

//
// ### @public function extendRouter (router, resource)
// #### @router {director.http.Router} Router to extend with routes
// #### @resources {resourceful.Resource} Resource(s) to use in routes.
// #### @options {Object} Options for routes added.
//
exports.extendRouter = function (router, resources, options) {
  options = options || {};
  var param = options.param || ':id',
  view = options.view || formful.form;

  if (!Array.isArray(resources)){
    resources = [resources];
  }

  //
  // Bind GET / to show all entities
  //
  router.get("/", function () {
    var res = this.res;
    view.admin.render({ resource: resources }, function(err, result){
      res.end(result);
    });
  });

  function _extendRouter (router, resources, options) {

    if (!Array.isArray(resources)){
      resources = [resources];
    }

    resources.forEach(function (resource) {

      var entity = resource.lowerResource,
          pluralEntity = inflect(entity);

      options.prefix = options.prefix || '';

      //
      // Check if resource has any children
      // If a resource has children, we'll need to recursively
      // call the extendRouter method, prefixing the current resource
      // as the base path
      //
      if (resource._children && resource._children.length > 0) {
        var childResource = resourceful.resources[resource._children[0]],
            clonedOptions = utile.clone(options);
        //
        // Remark: Create a new instance of options since we don't want,
        // to modify the reference scope inside this extendRouter call
        //
        clonedOptions.parent = resource;
        //
        // Extend the router to expose child resource as base path
        //
        _extendRouter(router, childResource, clonedOptions);

        //
        // Also, extend the router to expose child resource as child of parent
        //
        clonedOptions.prefix = '/' + pluralEntity + '/:id/';
        _extendRouter(router, childResource, clonedOptions);
      }

      //
      // Bind to /Resource path
      //
      router.path(options.prefix + '/' +  pluralEntity, function(){


        //
        // Bind POST /:resource/new
        //
        this.post("/new", function () {
          var res = this.res,
              req = this.req;

          if (req.errors) {
            view.create.render({ resource: resource, errors: req.errors }, function(err, result) {
              res.end(result);
            });
          } else {
            //
            // TODO : Replace with 301 redirect to show page
            //
            view.show.render({ resource: resource, data: req.data }, function(err, result) {
              res.end(result);
            });
          }
        });

        //
        // Bind GET /resource to list all resources
        //
        this.get("/", function () {
          var req = this.req,
              res = this.res;
          view.list.render({ resource: resource, data: req.data }, function(err, result) {
            //console.log('ner', result)
            res.end(result);
          });
        });

        //
        // Bind POST /resource to Create
        //
        this.post("/", function () {
          var req = this.req,
              res = this.res;
          view.list.render({ resource: resource, data: req.data }, function(err, result) {
            res.end(result);
          });
        });

        //
        // Bind GET /resource/:id to show entity
        //
        this.get(param, function (_id) {
          var req = this.req,
              res = this.res;
          if (_id === "new") {
            view.create.render({ resource: resource }, function(err, result){
              res.end(result);
            });
          } else {
            view.show.render({ _id: _id, resource: resource, data: req.data }, function(err, result) {
              res.end(result);
            });
          }
        });

        //
        // Bind GET /:resource/:id/destroy to show destroy form
        //
        this.get(param + "/destroy", function (_id) {
          var req = this.req,
              res = this.res;
          resource.get(_id, function (err, result) {
            if(err) {
              return res.end('404');
            }
            view.destroy.render({ _id: _id, resource: resource, data: result }, function(err, result){
              res.end(result);
            });
          });
        });

        //
        // Bind POST /:resource/:id/destroy
        //
        this.post(param + "/destroy", function (_id) {
          var req = this.req,
              res = this.res;
          console.log('TODO: REDIRECT')
          res.end('deleted');
        });

        //
        // Bind GET /Resourceful/:id/update to show edit form
        //
        this.get(param + "/update", function (_id) {
          var req = this.req,
              res = this.res;

              if (_id === "new") {
                res.writeHead(404);
                res.end();
                return;
              }

              //
              // Remark: If a parent has been passed in and we have a child id,
              // append together the child resource, parent resource, parent id, and child id,
              // to create the unique key to fetch
              //
              resource.get(_id, function (err, result) {
                if (err) {
                  res.writeHead(404);
                  res.end();
                  return;
                }
                view.update.render({ data: result, resource: resource }, function(err, result){
                  res.end(result);
                });
              });
        });
        //
        // Bind POST /Resourceful/:id to show form
        //
        this.post(param + "/update", function (_id) {
          var req = this.req,
              res = this.res;
            view.update.render({_id: _id, data: req.data, resource: resource, errors: req.errors, updated: true }, function(err, result) {
              res.end(result);
            });
        });
      });
    });
  }

  _extendRouter(router, resources, options);

  return router;
};

function inflect (str) {
  return utile.inflect.pluralize(str);
}