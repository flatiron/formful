var fs         = require('fs'),
    director   = require('director'),
    controller = require('../lib/formful/controller');

exports.createRouter = function (resource) {

  var router = new director.http.Router();

  //
  // Bind GET / to show all entities
  //
  router.get("/", function (params) {
    var res = this.res;
    controller.show(params, resource, function(err, result){
      res.end(result);
    });
  });
  
  //
  // Bind GET /create to show generic Create form
  //
  router.get("/create", function (options) {
    var res = this.res;
    controller.create(options, resource, function(err, result){
      res.end(result);
    });
  });
  
  //
  // Bind to /Resource path
  //
  router.path('/' + resource._resource, function(){

    //
    // Bind GET /Resourceful/:id/show to show entity
    //
    this.get("/:id/show", function (_id) {
      var res = this.res;
      controller.show(_id, resource, function(err, result){
        res.end(result);
      });
    });

    //
    // Bind GET /Resourceful/:id/destroy to show destroy form
    //
    this.get("/:id/destroy", function (_id) {
      var res = this.res;
      controller.destroy(_id, resource, function(err, result){
        res.end(result);
      });
    });
    
    //
    // Bind GET /Resourceful/:id/edit to show edit form
    //
    this.get("/:id/edit", function (_id) {
      var res = this.res;
      controller.update(_id, resource, function(err, result){
        res.end(result);
      });
    });
    
  });

  return router;

}
