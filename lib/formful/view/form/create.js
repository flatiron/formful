var utile = require('utile'),
    layout = require('./layout');

module['exports'] = function (options, callback) {

  options = options || {};
  var resource = options.resource;

 //
 // Presenter is scoped with the following variables for convience:
 //
 var $ = this.$,
     self = this,
     output = '',
     entity = resource.lowerResource;

  Object.keys(resource.schema.properties).forEach(function (property) {
    var input = utile.clone(resource.schema.properties[property]);
    input.name = property;
    input.value = input.default || '';
    if (input.writeable !== false) {
      output += layout.renderControl(input, options);
    }
  });

  $('h1').html(entity + ' - create');
  $('.back').html('back to ' + entity);
  $('.back').attr('href', '/' + entity);

  $('legend').html(entity + ' form');
  $('form').attr('action', '/' + entity + '/new');
  $('.inputs').html(output);
  $('input[type="submit"]').attr('value', 'Create new ' + entity);

  output = $.html();

  if (callback) {
    return callback(null, output);
  }
  return output;

}