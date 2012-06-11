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
// Remark: Sugar syntax for `createRouter`
//
formful.createRouter = formful.router.createRouter;