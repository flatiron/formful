var formful     = require('../lib/formful')

var macros = require('../test/macros'),
    fixtures = require('../test/fixtures');

formful.createServer([fixtures.Album, fixtures.Creature]).listen(8000, function () {
  console.log(' > formful server started on port 8000');
});

