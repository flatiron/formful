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