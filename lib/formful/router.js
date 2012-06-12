var formful  = require('../formful'),
    director = require('director'),
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
// GET     /creatures/1/edit    => view.edit(1)
// GET     /creatures/1/destroy => view.destroy(1)

//
var FormfulRouter = exports.FormfulRouter = function (resource, options) {
  options = options || {};
  options.strict = options.strict || false;

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
// #### @resource {resourceful.Resource} Resource to use in routes.
// #### @options {Object} Options for routes added.
//
exports.extendRouter = function (router, resource, options) {
  options = options || {};
  var entity = resource._resource.toLowerCase(),
      param = options.param || ':id',
      view = options.view || formful.view,
      pluralEntity;

  //
  // TODO: replace with proper inflection / pluralization library
  // see: https://github.com/flatiron/utile/blob/master/lib/index.js#L32
  pluralEntity = (entity + 's');

  //
  // Bind GET / to show all entities
  //
  router.get("/", function (params) {
    var res = this.res;
    view.show(params, resource, function(err, result){
      res.end(result);
    });
  });

  //
  // Bind GET /create to show generic Create form
  //
  router.get("/create", function (options) {
    var res = this.res;
    view.create(resource, options, function(err, result){
      res.end(result);
    });
  });

  //
  // Bind to /Resource path
  //
  router.path('/' + pluralEntity, function(){

    //
    // Bind GET /Resourceful to list all resources
    //
    this.get("/", function () {
      var res = this.res;
      view.show(null, resource, function(err, result) {
        res.end(result);
      });
    });

    //
    // Bind GET /Resourceful/:id/show to show entity
    //
    this.get("/:id/show", function (_id) {
      var res = this.res;
      view.show(_id, resource, function(err, result) {
        res.end(result);
      });
    });

    //
    // Bind GET /Resourceful/:id/destroy to show destroy form
    //
    this.get("/:id/destroy", function (_id) {
      var res = this.res;
      view.destroy(_id, resource, function(err, result){
        res.end(result);
      });
    });
    
    //
    // Bind GET /Resourceful/:id/edit to show edit form
    //
    this.get("/:id/edit", function (_id) {
      var res = this.res;
      view.update(_id, resource, function(err, result){
        res.end(result);
      });
    });
    
  });

  return router;

};
