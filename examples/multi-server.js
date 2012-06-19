var formful     = require('../lib/formful');
var addons = require('addons');
var resourceful = require('resourceful');

var Database = resourceful.define('database', addons.schemas.database);
var Dropbox = resourceful.define('dropbox', addons.schemas.dropbox);

formful.createServer([Database, Dropbox]).listen(8000, function () {
  console.log(' > formful server started on port 8000');
});
