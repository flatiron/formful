var formful  = require('../formful'),
    director = require('director');

exports.createRouter = function (resource, view) {

  view = formful.view || view;

  var router = new director.http.Router(),
  entity = resource._resource.toLowerCase(),
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

}